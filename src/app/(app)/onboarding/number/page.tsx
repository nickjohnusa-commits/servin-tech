"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepsIndicator } from "@/components/app/onboarding/steps-indicator";

export default function OnboardingStep2() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function provision() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/organizations/provision-number", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setPhone(data.phoneNumber);
      } else {
        setError(data.error ?? "Failed to provision number. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <StepsIndicator current={2} />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0f172a] mb-1">
          Get your AI phone number
        </h2>
        <p className="text-sm text-[#64748b] mb-6">
          We&apos;ll assign you a local US number. Customers call or text this
          number and your AI handles it 24/7.
        </p>

        {!phone ? (
          <div className="space-y-4">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
              <p className="text-sm text-[#64748b]">
                💡 <strong className="text-[#0f172a]">How it works:</strong> Give
                this number to your customers, or forward your main business number
                to it. Every missed call or text gets answered instantly by your AI.
              </p>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <button
              onClick={provision}
              disabled={loading}
              className="w-full bg-[#1b3a6b] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors"
            >
              {loading ? "Provisioning…" : "Get my AI number"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="text-3xl font-bold text-[#1b3a6b] tracking-wide mb-2">
                {phone}
              </div>
              <p className="text-sm text-[#10b981] font-medium">
                ✓ Your AI number is ready
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-800">
                <strong>Save this number.</strong> Share it with customers or set
                up call forwarding from your main line in your carrier settings.
              </p>
            </div>
            <button
              onClick={() => router.push("/onboarding/ai")}
              className="w-full bg-[#1b3a6b] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#162e55] transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        <button
          onClick={() => router.push("/onboarding/ai")}
          className="w-full mt-3 text-sm text-[#64748b] hover:text-[#0f172a] py-1"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
