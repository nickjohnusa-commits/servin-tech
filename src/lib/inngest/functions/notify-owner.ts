import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { sendSms } from "@/lib/twilio";
import { resend, FROM_EMAIL, newLeadEmailHtml } from "@/lib/resend";

export const notifyOwner = inngest.createFunction(
  {
    id: "notify-owner",
    name: "Notify owner on new lead",
    triggers: [{ event: "lead/created" }],
  },
  async ({ event }: { event: { data: { leadId: string; organizationId: string } } }) => {
    const { leadId, organizationId } = event.data;

    const [lead, org] = await Promise.all([
      db.lead.findUnique({ where: { id: leadId } }),
      db.organization.findUnique({ where: { id: organizationId } }),
    ]);

    if (!lead || !org) return { skipped: true };
    if (lead.testLead) return { skipped: true, reason: "test lead" };

    const smsBody =
      lead.languageDetected === "ES"
        ? `📞 Nuevo cliente: ${lead.callerPhone}\nTrabajo: ${lead.jobType ?? "—"}\nUrgencia: ${lead.urgency ?? "—"}/10\nDirección: ${lead.address ?? "—"}\nVer: ${process.env.NEXT_PUBLIC_APP_URL}/leads/${lead.id}`
        : `📞 New lead: ${lead.callerPhone}\nJob: ${lead.jobType ?? "—"}\nUrgency: ${lead.urgency ?? "—"}/10\nAddress: ${lead.address ?? "—"}\nView: ${process.env.NEXT_PUBLIC_APP_URL}/leads/${lead.id}`;

    const smsResults = await Promise.allSettled(
      org.notificationPhones.map((phone: string) =>
        sendSms(phone, org.twilioPhoneNumber!, smsBody, false)
      )
    );

    const emailResults = await Promise.allSettled(
      org.notificationEmails.map((email: string) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `New Lead: ${lead.jobType ?? "Home Service"} — ${lead.callerPhone}`,
          html: newLeadEmailHtml({
            callerPhone: lead.callerPhone,
            callerName: lead.callerName,
            jobType: lead.jobType,
            urgency: lead.urgency,
            address: lead.address,
            budgetRange: lead.budgetRange,
            preferredAppointment: lead.preferredAppointment,
            aiSummary: lead.aiSummary,
            languageDetected: lead.languageDetected,
            channel: lead.channel,
          }),
        })
      )
    );

    return {
      leadId,
      smsSent: smsResults.filter((r) => r.status === "fulfilled").length,
      emailSent: emailResults.filter((r) => r.status === "fulfilled").length,
    };
  }
);
