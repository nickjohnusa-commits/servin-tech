"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepsIndicator } from "@/components/app/onboarding/steps-indicator";

export default function OnboardingStep4() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);

  function addEmail() {
    const v = emailInput.trim();
    if (v && v.includes("@") && !emails.includes(v)) {
      setEmails([...emails, v]);
      setEmailInput("");
    }
  }

  function addPhone() {
    const v = phoneInput.replace(/\D/g, "");
    if (v.length >= 10 && !phones.includes(v)) {
      setPhones([...phones, `+1${v.slice(-10)}`]);
      setPhoneInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/organizations/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationEmails: emails, notificationPhones: phones }),
      });
      router.push("/onboarding/subscribe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <StepsIndicator current={4} />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0f172a] mb-1">
          Who gets notified?
        </h2>
        <p className="text-sm text-[#64748b] mb-6">
          Add the email addresses and phone numbers that should receive instant
          alerts when a new lead comes in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Email notifications
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="owner@yourbusiness.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
                className="flex-1 border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-3 py-2 bg-[#f1f5f9] border border-[#e2e8f0] rounded-md text-sm text-[#64748b] hover:bg-[#e2e8f0]"
              >
                Add
              </button>
            </div>
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {emails.map((e) => (
                  <span
                    key={e}
                    className="inline-flex items-center gap-1 bg-[#f1f5f9] text-[#0f172a] text-xs px-2 py-1 rounded-full"
                  >
                    {e}
                    <button
                      type="button"
                      onClick={() => setEmails(emails.filter((x) => x !== e))}
                      className="text-[#94a3b8] hover:text-red-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              SMS notifications
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="(786) 555-0100"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhone())}
                className="flex-1 border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
              <button
                type="button"
                onClick={addPhone}
                className="px-3 py-2 bg-[#f1f5f9] border border-[#e2e8f0] rounded-md text-sm text-[#64748b] hover:bg-[#e2e8f0]"
              >
                Add
              </button>
            </div>
            {phones.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {phones.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 bg-[#f1f5f9] text-[#0f172a] text-xs px-2 py-1 rounded-full"
                  >
                    {p}
                    <button
                      type="button"
                      onClick={() => setPhones(phones.filter((x) => x !== p))}
                      className="text-[#94a3b8] hover:text-red-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b3a6b] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving…" : "Continue →"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/onboarding/subscribe")}
            className="w-full text-sm text-[#64748b] hover:text-[#0f172a] py-1"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
