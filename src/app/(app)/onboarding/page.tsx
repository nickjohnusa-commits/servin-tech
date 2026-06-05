"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepsIndicator } from "@/components/app/onboarding/steps-indicator";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
];

export default function OnboardingStep1() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    timezone: "America/New_York",
    areaCode: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/organizations/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) router.push("/onboarding/number");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <StepsIndicator current={1} />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0f172a] mb-1">
          Tell us about your business
        </h2>
        <p className="text-sm text-[#64748b] mb-6">
          This is what your AI receptionist will introduce itself with.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Business name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rodriguez HVAC & Plumbing"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Timezone <span className="text-red-500">*</span>
            </label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace("America/", "").replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Area code (for your AI phone number)
            </label>
            <input
              type="text"
              placeholder="e.g. 786"
              maxLength={3}
              value={form.areaCode}
              onChange={(e) =>
                setForm({ ...form, areaCode: e.target.value.replace(/\D/g, "") })
              }
              className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <p className="text-xs text-[#94a3b8] mt-1">
              Leave blank to get any available US number
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || !form.businessName}
            className="w-full bg-[#1b3a6b] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? "Saving…" : "Continue →"}
          </button>
        </form>
      </div>
    </div>
  );
}
