"use client";

import { useState } from "react";

type Member = { id: string; name: string; email: string; role: string };
type Props = { members: Member[] };

export function SettingsTeam({ members }: Props) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setSending(true); setError("");
    try {
      const res = await fetch("/api/organizations/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (res.ok) { setSent(true); setInviteEmail(""); setTimeout(() => setSent(false), 3000); }
      else setError(data.error ?? "Failed to send invite");
    } finally { setSending(false); }
  }

  return (
    <div className="space-y-5">
      {/* Current members */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl">
        <div className="p-5 border-b border-[#e2e8f0]">
          <h2 className="text-sm font-semibold text-[#0f172a]">Team members</h2>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-[#0f172a]">{m.name || m.email}</p>
                <p className="text-xs text-[#94a3b8]">{m.email}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                m.role === "OWNER"
                  ? "bg-[#1b3a6b] text-white"
                  : "bg-[#f1f5f9] text-[#64748b]"
              }`}>
                {m.role === "OWNER" ? "Owner" : "Dispatcher"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Invite a dispatcher</h2>
        <p className="text-xs text-[#64748b] mb-4">
          Dispatchers can view leads and move them through the pipeline. They cannot access billing or AI settings.
        </p>
        <form onSubmit={invite} className="flex gap-2">
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="dispatcher@yourbusiness.com"
            className="flex-1 border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
          <button type="submit" disabled={sending}
            className="bg-[#1b3a6b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors whitespace-nowrap">
            {sent ? "✓ Sent!" : sending ? "Sending…" : "Send invite"}
          </button>
        </form>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
