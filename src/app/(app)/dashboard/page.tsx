import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatRelative, urgencyColor, urgencyLabel } from "@/lib/utils";
import { LanguageBadge } from "@/components/shared/language-badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import Link from "next/link";

export default async function DashboardPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const [totalLeads, leadsToday, leadsThisWeek, wonLeads, recentLeads, pipelineCounts] =
    await Promise.all([
      db.lead.count({ where: { organizationId: org.id, testLead: false } }),
      db.lead.count({ where: { organizationId: org.id, testLead: false, createdAt: { gte: startOfDay } } }),
      db.lead.count({ where: { organizationId: org.id, testLead: false, createdAt: { gte: startOfWeek } } }),
      db.lead.count({ where: { organizationId: org.id, testLead: false, status: "WON" } }),
      db.lead.findMany({
        where: { organizationId: org.id, testLead: false },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      db.lead.groupBy({
        by: ["status"],
        where: { organizationId: org.id, testLead: false },
        _count: true,
      }),
    ]);

  const conversionRate =
    totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  const statusCounts = Object.fromEntries(
    pipelineCounts.map((p: { status: string; _count: number }) => [p.status, p._count])
  );

  const statuses = [
    "NEW", "CONTACTED", "ESTIMATE_SCHEDULED", "ESTIMATE_SENT", "WON", "LOST",
  ] as const;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Leads today", value: leadsToday, sub: "new inquiries" },
          { label: "This week", value: leadsThisWeek, sub: "last 7 days" },
          { label: "Total leads", value: totalLeads, sub: "all time" },
          { label: "Conversion rate", value: `${conversionRate}%`, sub: `${wonLeads} won` },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <p className="text-xs text-[#64748b] font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-[#0f172a]">{s.value}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Pipeline summary */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#0f172a]">Pipeline</h2>
          <Link href="/pipeline" className="text-xs text-[#2563eb] hover:underline">
            View kanban →
          </Link>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {statuses.map((s) => (
            <div key={s} className="text-center">
              <div
                className="text-xl font-bold mb-1"
                style={{ color: STATUS_COLORS[s] }}
              >
                {statusCounts[s] ?? 0}
              </div>
              <div className="text-[10px] text-[#64748b] leading-tight">
                {STATUS_LABELS[s]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
          <h2 className="text-sm font-semibold text-[#0f172a]">Recent leads</h2>
          <Link href="/leads" className="text-xs text-[#2563eb] hover:underline">
            View all →
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-2xl mb-2">📞</p>
            <p className="text-sm font-medium text-[#0f172a]">No leads yet</p>
            <p className="text-xs text-[#64748b] mt-1">
              Leads will appear here when customers call or text your AI number.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9]">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(recentLeads as any[]).map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f8fafc] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-[#0f172a] truncate">
                      {lead.callerName ?? lead.callerPhone}
                    </span>
                    <LanguageBadge language={lead.languageDetected as "EN" | "ES" | "AUTO"} />
                    <span className="text-xs text-[#94a3b8]">
                      {lead.channel === "VOICE" ? "📞" : "💬"}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] truncate">
                    {lead.jobType ?? "—"}{lead.address ? ` · ${lead.address}` : ""}
                  </p>
                </div>
                {lead.urgency && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor(lead.urgency)}`}
                  >
                    {urgencyLabel(lead.urgency)}
                  </span>
                )}
                <div className="text-right shrink-0">
                  <div
                    className="text-xs font-medium mb-0.5"
                    style={{ color: STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS] }}
                  >
                    {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS]}
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    {formatRelative(lead.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
