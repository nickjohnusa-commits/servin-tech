import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "noreply@servintech.com";

export function newLeadEmailHtml(lead: {
  callerPhone: string;
  callerName?: string | null;
  jobType?: string | null;
  urgency?: number | null;
  address?: string | null;
  budgetRange?: string | null;
  preferredAppointment?: string | null;
  aiSummary?: string | null;
  languageDetected: string;
  channel: string;
}): string {
  const urgencyBadge =
    lead.urgency && lead.urgency >= 9
      ? `<span style="color:#dc2626;font-weight:600;">🔴 Emergency (${lead.urgency}/10)</span>`
      : lead.urgency && lead.urgency >= 7
        ? `<span style="color:#d97706;font-weight:600;">🟡 Urgent (${lead.urgency}/10)</span>`
        : `<span style="color:#2563eb;">${lead.urgency ?? "—"}/10</span>`;

  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;">
      <div style="background:#1b3a6b;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:18px;font-weight:600;">🔔 New Lead — Servin Tech Solutions</h1>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:140px;">Caller</td><td style="padding:8px 0;font-size:14px;font-weight:500;">${lead.callerName ?? "Unknown"} · ${lead.callerPhone}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Channel</td><td style="padding:8px 0;font-size:14px;">${lead.channel === "VOICE" ? "📞 Phone Call" : "💬 Text Message"} · ${lead.languageDetected === "ES" ? "🇲🇽 Spanish" : "🇺🇸 English"}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Job Type</td><td style="padding:8px 0;font-size:14px;font-weight:500;">${lead.jobType ?? "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Urgency</td><td style="padding:8px 0;">${urgencyBadge}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Address</td><td style="padding:8px 0;font-size:14px;">${lead.address ?? "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Budget</td><td style="padding:8px 0;font-size:14px;">${lead.budgetRange ?? "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Preferred Time</td><td style="padding:8px 0;font-size:14px;">${lead.preferredAppointment ?? "—"}</td></tr>
        </table>
        ${lead.aiSummary ? `<div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:6px;border-left:3px solid #2563eb;"><p style="margin:0;font-size:13px;color:#0f172a;">${lead.aiSummary}</p></div>` : ""}
        <div style="margin-top:24px;text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/leads" style="background:#1b3a6b;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;">View Lead in Dashboard</a>
        </div>
      </div>
      <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:16px;">Servin Tech Solutions · AI Reception Platform</p>
    </div>
  `;
}
