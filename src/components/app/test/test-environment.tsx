"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelative } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import Link from "next/link";

type TestLead = {
  id: string;
  callerPhone: string;
  callerName: string | null;
  jobType: string | null;
  urgency: number | null;
  status: string;
  channel: string;
  languageDetected: string;
  createdAt: Date;
};

type Props = {
  testMode: boolean;
  orgId: string;
  phoneNumber: string | null;
  testLeads: TestLead[];
};

export function TestEnvironment({ testMode, orgId, phoneNumber, testLeads }: Props) {
  const router = useRouter();
  const [toggling, setToggling] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [smsForm, setSmsForm] = useState({ phone: "+15005550006", message: "Hi, I need my AC fixed urgently" });
  const [smsReply, setSmsReply] = useState<string | null>(null);

  async function toggleTestMode() {
    setToggling(true);
    await fetch("/api/organizations/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testMode: !testMode }),
    });
    setToggling(false);
    router.refresh();
  }

  async function simulateSms(e: React.FormEvent) {
    e.preventDefault();
    setSimulating(true);
    setSmsReply(null);
    try {
      const res = await fetch("/api/test/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...smsForm, orgId }),
      });
      const data = await res.json();
      setSmsReply(data.reply ?? data.error ?? "No response");
    } finally {
      setSimulating(false);
      router.refresh();
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Test mode toggle */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Test Mode</h2>
            <p className="text-xs text-[#64748b] max-w-sm">
              When ON, all leads are marked as test leads and kept separate from your real
              pipeline. Turn OFF when you&apos;re ready to go live.
            </p>
          </div>
          <button
            onClick={toggleTestMode}
            disabled={toggling}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              testMode ? "bg-amber-400" : "bg-[#e2e8f0]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                testMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        {testMode && (
          <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-xs text-amber-800 font-medium">
              Test Mode is ON — all leads are isolated from your real pipeline
            </p>
          </div>
        )}
        {!testMode && (
          <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-xs text-green-800 font-medium">
              Live Mode — real customers calling {phoneNumber ?? "your number"} will be handled by AI
            </p>
          </div>
        )}
      </div>

      {/* Simulate SMS */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Simulate a text message</h2>
        <p className="text-xs text-[#64748b] mb-4">
          Send a test SMS through your AI and see exactly what the customer experience looks like.
        </p>
        <form onSubmit={simulateSms} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Simulated caller phone
              </label>
              <input
                type="text"
                value={smsForm.phone}
                onChange={(e) => setSmsForm({ ...smsForm, phone: e.target.value })}
                className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Message
              </label>
              <input
                type="text"
                value={smsForm.message}
                onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={simulating}
            className="bg-[#1b3a6b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors"
          >
            {simulating ? "Simulating…" : "Send test SMS"}
          </button>
        </form>
        {smsReply && (
          <div className="mt-4 bg-[#1b3a6b] text-white rounded-xl px-4 py-3 text-sm max-w-sm">
            <p className="text-[10px] text-blue-300 mb-1">AI REPLY</p>
            {smsReply}
          </div>
        )}
      </div>

      {/* Test phone instruction */}
      {phoneNumber && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Simulate a phone call</h2>
          <p className="text-xs text-[#64748b] mb-3">
            Call your AI number from your phone to test the full voice experience.
          </p>
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#1b3a6b] tracking-wide">{phoneNumber}</p>
            <p className="text-xs text-[#64748b] mt-1">Your AI reception number — call it now</p>
          </div>
        </div>
      )}

      {/* Test leads */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl">
        <div className="p-5 border-b border-[#e2e8f0]">
          <h2 className="text-sm font-semibold text-[#0f172a]">
            Test leads ({testLeads.length})
          </h2>
        </div>
        {testLeads.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#64748b]">No test leads yet — simulate a call or SMS above.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9]">
            {testLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-[#f8fafc] transition-colors"
              >
                <span className="text-sm">{lead.channel === "VOICE" ? "📞" : "💬"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0f172a] truncate">
                    {lead.callerName ?? lead.callerPhone}
                  </p>
                  <p className="text-xs text-[#64748b]">{lead.jobType ?? "—"}</p>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS],
                    background: `${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]}18`,
                  }}
                >
                  {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS]}
                </span>
                <span className="text-xs text-[#94a3b8]">{formatRelative(lead.createdAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
