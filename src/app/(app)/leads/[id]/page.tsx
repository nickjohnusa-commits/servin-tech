import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate, formatPhone, urgencyColor, urgencyLabel } from "@/lib/utils";
import { LanguageBadge } from "@/components/shared/language-badge";
import { LeadActions } from "@/components/app/leads/lead-actions";
import type { TranscriptMessage } from "@/types";

export const dynamic = "force-dynamic";

function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  const { id } = await params;
  const lead = await db.lead.findFirst({
    where: { id, organizationId: org.id },
    include: { conversations: true, followUps: { orderBy: { scheduledAt: "asc" } } },
  });

  if (!lead) notFound();

  const qualFields = [
    { label: "Job type", value: lead.jobType },
    { label: "Urgency", value: lead.urgency ? `${lead.urgency}/10 — ${urgencyLabel(lead.urgency)}` : null },
    { label: "Address", value: lead.address },
    { label: "Budget range", value: lead.budgetRange },
    { label: "Preferred appointment", value: lead.preferredAppointment },
    { label: "Channel", value: lead.channel === "VOICE" ? "📞 Phone call" : "💬 Text message" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-semibold text-[#0f172a]">
                {lead.callerName ?? formatPhone(lead.callerPhone)}
              </h1>
              <LanguageBadge language={lead.languageDetected as "EN" | "ES" | "AUTO"} />
              {lead.testLead && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Test lead
                </span>
              )}
            </div>
            {lead.callerName && (
              <p className="text-sm text-[#64748b]">{formatPhone(lead.callerPhone)}</p>
            )}
            <p className="text-xs text-[#94a3b8] mt-1">{formatDate(lead.createdAt)}</p>
          </div>
          <LeadActions lead={lead} />
        </div>

        {lead.aiSummary && (
          <div className="mt-4 p-4 bg-[#f8fafc] border-l-4 border-[#2563eb] rounded-r-lg">
            <p className="text-xs font-semibold text-[#64748b] mb-1">AI SUMMARY</p>
            <p className="text-sm text-[#0f172a]">{lead.aiSummary}</p>
          </div>
        )}
      </div>

      {/* Qualification grid */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Qualification details</h2>
        <div className="grid grid-cols-2 gap-4">
          {qualFields.map((f) => (
            <div key={f.label}>
              <p className="text-xs text-[#64748b] font-medium mb-0.5">{f.label}</p>
              {f.label === "Urgency" && lead.urgency ? (
                <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${urgencyColor(lead.urgency)}`}>
                  {f.value}
                </span>
              ) : (
                <p className="text-sm text-[#0f172a] font-medium">{f.value ?? "—"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transcript */}
      {lead.conversations.length > 0 && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-4">
            Conversation transcript
            {lead.conversations[0].durationSecs && (
              <span className="ml-2 text-xs font-normal text-[#94a3b8]">
                ({Math.floor(lead.conversations[0].durationSecs / 60)}m {lead.conversations[0].durationSecs % 60}s)
              </span>
            )}
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {(lead.conversations[0].transcript as TranscriptMessage[]).map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                    msg.role === "assistant"
                      ? "bg-[#1b3a6b] text-white"
                      : "bg-[#f1f5f9] text-[#0f172a]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos */}
      {lead.photoUrls.length > 0 && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Photos</h2>
          <div className="grid grid-cols-3 gap-3">
            {(lead.photoUrls as string[]).filter(isSafeUrl).map((url: string, i: number) => (
              <a key={i} href={url} target="_blank" rel="noreferrer noopener">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Lead photo ${i + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-[#e2e8f0] hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Follow-ups */}
      {lead.followUps.length > 0 && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Follow-up history</h2>
          <div className="space-y-2">
            {(lead.followUps as import("@/types").FollowUp[]).map((fu) => (
              <div key={fu.id} className="flex items-start gap-3 text-sm">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${
                    fu.status === "SENT"
                      ? "bg-green-50 text-green-700"
                      : fu.status === "FAILED"
                        ? "bg-red-50 text-red-700"
                        : "bg-[#f1f5f9] text-[#64748b]"
                  }`}
                >
                  {fu.status}
                </span>
                <p className="text-[#64748b] flex-1 text-xs">{fu.message}</p>
                <span className="text-xs text-[#94a3b8] shrink-0">
                  {formatDate(fu.scheduledAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
