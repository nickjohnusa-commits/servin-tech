"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { notificationEmails: string[]; notificationPhones: string[] };

export function SettingsNotifications({ notificationEmails, notificationPhones }: Props) {
  const router = useRouter();
  const [emails, setEmails] = useState<string[]>(notificationEmails);
  const [phones, setPhones] = useState<string[]>(notificationPhones);
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addEmail() {
    const v = emailInput.trim();
    if (v.includes("@") && !emails.includes(v)) { setEmails([...emails, v]); setEmailInput(""); }
  }

  function addPhone() {
    const v = phoneInput.replace(/\D/g, "");
    const e164 = `+1${v.slice(-10)}`;
    if (v.length >= 10 && !phones.includes(e164)) { setPhones([...phones, e164]); setPhoneInput(""); }
  }

  async function save() {
    setSaving(true);
    await fetch("/api/organizations/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationEmails: emails, notificationPhones: phones }),
    });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); router.refresh();
  }

  return (
    <div className="space-y-5">
      {/* Emails */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Email notifications</h2>
        <p className="text-xs text-[#64748b] mb-4">
          These addresses receive an instant email with lead details when a new call or text comes in.
        </p>
        <div className="flex gap-2 mb-3">
          <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
            placeholder="dispatcher@yourbusiness.com"
            className="flex-1 border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]" />
          <button type="button" onClick={addEmail}
            className="px-3 py-2 bg-[#f1f5f9] border border-[#e2e8f0] rounded-md text-sm text-[#64748b] hover:bg-[#e2e8f0]">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {emails.map((e) => (
            <span key={e} className="inline-flex items-center gap-1 bg-[#f1f5f9] text-[#0f172a] text-xs px-2.5 py-1 rounded-full">
              {e}
              <button onClick={() => setEmails(emails.filter((x) => x !== e))}
                className="text-[#94a3b8] hover:text-red-500 ml-0.5">×</button>
            </span>
          ))}
          {emails.length === 0 && <p className="text-xs text-[#94a3b8]">No emails added yet</p>}
        </div>
      </div>

      {/* Phones */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-1">SMS notifications</h2>
        <p className="text-xs text-[#64748b] mb-4">
          These phone numbers get an instant text message when a new lead comes in.
        </p>
        <div className="flex gap-2 mb-3">
          <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhone())}
            placeholder="(786) 555-0100"
            className="flex-1 border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]" />
          <button type="button" onClick={addPhone}
            className="px-3 py-2 bg-[#f1f5f9] border border-[#e2e8f0] rounded-md text-sm text-[#64748b] hover:bg-[#e2e8f0]">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {phones.map((p) => (
            <span key={p} className="inline-flex items-center gap-1 bg-[#f1f5f9] text-[#0f172a] text-xs px-2.5 py-1 rounded-full">
              {p}
              <button onClick={() => setPhones(phones.filter((x) => x !== p))}
                className="text-[#94a3b8] hover:text-red-500 ml-0.5">×</button>
            </span>
          ))}
          {phones.length === 0 && <p className="text-xs text-[#94a3b8]">No phones added yet</p>}
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="bg-[#1b3a6b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors">
        {saved ? "✓ Saved" : saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
