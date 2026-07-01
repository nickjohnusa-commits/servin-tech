import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";

export const monthlyReport = inngest.createFunction(
  {
    id: "monthly-report",
    name: "Generate and email monthly report",
    triggers: [{ cron: "0 8 1 * *" }],
  },
  async () => {
    const now = new Date();
    const month = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    const orgs = await db.organization.findMany({
      where: {
        subscriptionStatus: { in: ["ACTIVE", "TRIALING"] },
      },
    });

    const activeOrgs = orgs.filter(
      (org: { notificationEmails: string[] }) => org.notificationEmails.length > 0
    );
    const results = await Promise.allSettled(
      activeOrgs.map((org: { id: string }) => generateAndSendReport(org.id, month, year))
    );
    results.forEach((r, i) => {
      if (r.status === "rejected")
        console.error(`[monthly-report] org ${activeOrgs[i].id} failed:`, r.reason);
    });

    return {
      processed: orgs.length,
      succeeded: results.filter((r) => r.status === "fulfilled").length,
    };
  }
);

async function generateAndSendReport(orgId: string, month: number, year: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) return;

  const leads = await db.lead.findMany({
    where: {
      organizationId: orgId,
      createdAt: { gte: startDate, lt: endDate },
      testLead: false,
    },
  });

  const byStatus = leads.reduce((acc: Record<string, number>, l: { status: string }) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});

  const byJobType = leads.reduce((acc: Record<string, number>, l: { jobType: string | null }) => {
    const k = l.jobType ?? "Other";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const byLanguage = {
    EN: leads.filter((l: { languageDetected: string }) => l.languageDetected === "EN").length,
    ES: leads.filter((l: { languageDetected: string }) => l.languageDetected === "ES").length,
  };

  const byChannel = {
    VOICE: leads.filter((l: { channel: string }) => l.channel === "VOICE").length,
    SMS: leads.filter((l: { channel: string }) => l.channel === "SMS").length,
  };

  const won = byStatus["WON"] ?? 0;
  const conversionRate =
    leads.length > 0 ? Math.round((won / leads.length) * 100) : 0;

  const data = { totalLeads: leads.length, byStatus, byJobType, byLanguage, byChannel, won, conversionRate };

  await db.monthlyReport.upsert({
    where: { organizationId_month_year: { organizationId: orgId, month, year } },
    create: { organizationId: orgId, month, year, data },
    update: { data },
  });

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const html = buildReportEmail(org.businessName, monthNames[month - 1], year, data);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: org.notificationEmails,
    subject: `${org.businessName} — ${monthNames[month - 1]} ${year} AI Reception Report`,
    html,
  });

  await db.monthlyReport.update({
    where: { organizationId_month_year: { organizationId: orgId, month, year } },
    data: { emailSentAt: new Date() },
  });
}

function buildReportEmail(businessName: string, month: string, year: number, data: {
  totalLeads: number; byStatus: Record<string, number>; byJobType: Record<string, number>;
  byLanguage: { EN: number; ES: number }; byChannel: { VOICE: number; SMS: number };
  conversionRate: number; won: number;
}) {
  const topJobType = Object.entries(data.byJobType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  return `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;"><div style="background:#1b3a6b;padding:20px 24px;border-radius:8px 8px 0 0;"><h1 style="color:#fff;margin:0;font-size:18px;">📊 ${month} ${year} — AI Reception Report</h1><p style="color:#93c5fd;margin:4px 0 0;font-size:13px;">${businessName}</p></div><div style="background:#fff;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;"><p><strong>Total Leads:</strong> ${data.totalLeads} &nbsp;|&nbsp; <strong>Won:</strong> ${data.won} &nbsp;|&nbsp; <strong>Conversion:</strong> ${data.conversionRate}%</p><p>📞 Voice: ${data.byChannel.VOICE} &nbsp;|&nbsp; 💬 SMS: ${data.byChannel.SMS}</p><p>🇺🇸 English: ${data.byLanguage.EN} &nbsp;|&nbsp; 🇲🇽 Spanish: ${data.byLanguage.ES}</p><p>Top job type: ${topJobType}</p><div style="text-align:center;margin-top:20px;"><a href="${process.env.NEXT_PUBLIC_APP_URL}/reports" style="background:#1b3a6b;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">View Full Report</a></div></div></div>`;
}
