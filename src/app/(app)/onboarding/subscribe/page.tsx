"use client";

import { useState } from "react";
import { StepsIndicator } from "@/components/app/onboarding/steps-indicator";
import { PLANS } from "@/lib/stripe/client";

export default function OnboardingStep5() {
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(tier: keyof typeof PLANS) {
    setLoading(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <StepsIndicator current={5} />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0f172a] mb-1 text-center">
          Choose your plan
        </h2>
        <p className="text-sm text-[#64748b] mb-6 text-center">
          Start free. Cancel anytime. No setup fees.
        </p>
        <div className="space-y-3">
          {(Object.entries(PLANS) as [keyof typeof PLANS, (typeof PLANS)[keyof typeof PLANS]][]).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`border rounded-xl p-5 ${
                  key === "PROFESSIONAL"
                    ? "border-[#1b3a6b] ring-1 ring-[#1b3a6b]"
                    : "border-[#e2e8f0]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0f172a] text-sm">
                        {plan.name}
                      </span>
                      {key === "PROFESSIONAL" && (
                        <span className="text-[10px] bg-[#1b3a6b] text-white px-2 py-0.5 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-bold text-[#0f172a] mt-1">
                      ${plan.price}
                      <span className="text-sm font-normal text-[#64748b]">/mo</span>
                    </p>
                  </div>
                  <button
                    onClick={() => checkout(key)}
                    disabled={loading !== null}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
                      key === "PROFESSIONAL"
                        ? "bg-[#1b3a6b] text-white hover:bg-[#162e55]"
                        : "bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e2e8f0] border border-[#e2e8f0]"
                    }`}
                  >
                    {loading === key ? "Redirecting…" : "Select"}
                  </button>
                </div>
                <ul className="space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#64748b]">
                      <span className="text-[#10b981] mt-px">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
