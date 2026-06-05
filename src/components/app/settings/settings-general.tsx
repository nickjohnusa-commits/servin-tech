"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIMEZONES = [
  "America/New_York","America/Chicago","America/Denver",
  "America/Los_Angeles","America/Phoenix","America/Anchorage","Pacific/Honolulu",
];

type Props = {
  businessName: string;
  timezone: string;
  twilioPhoneNumber: string | null;
};

export function SettingsGeneral({ businessName, timezone, twilioPhoneNumber }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ businessName, timezone });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/organizations/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Business information</h2>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#64748b] mb-1.5">Business name</label>
            <input
              type="text"
              required
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748b] mb-1.5">Timezone</label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz.replace("America/", "").replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748b] mb-1.5">AI phone number</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={twilioPhoneNumber ?? "Not provisioned yet"}
                className="flex-1 border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f1f5f9] text-[#64748b]"
              />
              {!twilioPhoneNumber && (
                <a href="/onboarding/number" className="text-xs text-[#2563eb] hover:underline shrink-0">
                  Provision →
                </a>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1b3a6b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors"
          >
            {saved ? "✓ Saved" : saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
