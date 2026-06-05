"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { followUpEnabled: boolean; followUpDays: number[] };

export function SettingsFollowUps({ followUpEnabled, followUpDays }: Props) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(followUpEnabled);
  const [days, setDays] = useState(followUpDays.join(", "));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = days.split(",").map((d) => parseInt(d.trim(), 10)).filter((d) => !isNaN(d) && d > 0);
    if (parsed.length === 0) { setError("Enter at least one day number."); return; }
    if (parsed.some((d) => d > 30)) { setError("Days must be 30 or fewer."); return; }
    setError("");
    setSaving(true);
    await fetch("/api/organizations/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followUpEnabled: enabled, followUpDays: parsed }),
    });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); router.refresh();
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
      <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Automatic follow-ups</h2>
      <p className="text-xs text-[#64748b] mb-5">
        When a lead moves to <strong>Estimate Sent</strong>, the AI sends follow-up messages
        automatically on the days you configure. Follow-ups stop if the lead is marked Won or Lost.
      </p>
      <form onSubmit={save} className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#0f172a]">Enable follow-ups</p>
            <p className="text-xs text-[#94a3b8]">Send automated SMS follow-ups on estimate sent leads</p>
          </div>
          <button type="button" onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#1b3a6b]" : "bg-[#e2e8f0]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {enabled && (
          <div>
            <label className="block text-xs font-medium text-[#64748b] mb-1.5">
              Follow-up days (comma-separated)
            </label>
            <input
              type="text"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="1, 3, 7"
              className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <p className="text-xs text-[#94a3b8] mt-1">
              Day 1 = SMS, Day 3 = Email + SMS, Day 7 = Final SMS
            </p>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        )}

        <button type="submit" disabled={saving}
          className="bg-[#1b3a6b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors">
          {saved ? "✓ Saved" : saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
