import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { sendSms } from "@/lib/twilio";
import { resend, FROM_EMAIL } from "@/lib/resend";

export const followUpSequence = inngest.createFunction(
  {
    id: "follow-up-sequence",
    name: "Schedule follow-up sequence on estimate sent",
    triggers: [{ event: "lead/estimate-sent" }],
  },
  async ({
    event,
    step,
  }: {
    event: { data: { leadId: string; organizationId: string } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    step: any;
  }) => {
    const { leadId, organizationId } = event.data;

    const [lead, org] = await Promise.all([
      db.lead.findUnique({ where: { id: leadId } }),
      db.organization.findUnique({ where: { id: organizationId } }),
    ]);

    if (!lead || !org) return { skipped: true };
    if (!org.followUpEnabled) return { skipped: true, reason: "follow-ups disabled" };
    if (lead.testLead) return { skipped: true, reason: "test lead" };

    const days: number[] = org.followUpDays ?? [1, 3, 7];

    for (const day of days) {
      await step.sleep(`wait-day-${day}`, `${day}d`);

      const current = await db.lead.findUnique({ where: { id: leadId } });
      if (!current || current.status === "WON" || current.status === "LOST") {
        return { stopped: true, reason: `lead is ${current?.status ?? "gone"}` };
      }

      const isEs = current.languageDetected === "ES";
      const name = current.callerName ?? (isEs ? "cliente" : "there");
      const job = current.jobType ?? (isEs ? "su servicio" : "your service request");

      let message: string;
      if (day === days[0]) {
        message = isEs
          ? `Hola ${name}, soy del equipo de ${org.businessName}. Solo quería asegurarme de que recibió la estimación para ${job}. ¿Tiene alguna pregunta? Llame o escriba en cualquier momento.`
          : `Hi ${name}, this is ${org.businessName} following up on your estimate for ${job}. Any questions? Feel free to call or text us anytime.`;
      } else if (day === days[1]) {
        message = isEs
          ? `Hola ${name}, ${org.businessName} de nuevo. ¿Le sería útil programar una cita para hablar sobre ${job}? Llámenos o responda a este mensaje.`
          : `Hi ${name}, ${org.businessName} again. Would it help to schedule a quick call about the ${job} estimate? Just reply or give us a call.`;
      } else {
        message = isEs
          ? `Hola ${name}, última nota de ${org.businessName}. Si aún necesita ayuda con ${job}, estaremos encantados de servirle. ¡Que tenga un buen día!`
          : `Hi ${name}, last note from ${org.businessName}. If you still need help with ${job}, we'd love to earn your business. Have a great day!`;
      }

      await Promise.allSettled(
        [org.twilioPhoneNumber].filter(Boolean).map(() =>
          sendSms(current.callerPhone, org.twilioPhoneNumber!, message, false)
        )
      );

      if (day === days[1] && org.notificationEmails.length > 0) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: org.notificationEmails[0],
          subject: isEs
            ? `Seguimiento: ${job} — ${org.businessName}`
            : `Follow-up: ${job} — ${org.businessName}`,
          html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;">${message}</div>`,
        });
      }

      await db.followUp.create({
        data: {
          leadId,
          organizationId,
          type: "SMS",
          message,
          status: "SENT",
          scheduledAt: new Date(),
          sentAt: new Date(),
        },
      });
    }

    return { leadId, followUpsSent: days.length };
  }
);
