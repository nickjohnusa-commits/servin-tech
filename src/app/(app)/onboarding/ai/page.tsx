"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepsIndicator } from "@/components/app/onboarding/steps-indicator";

export default function OnboardingStep3() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"AUTO" | "EN" | "ES">("AUTO");
  const [greetingEn, setGreetingEn] = useState("");
  const [greetingEs, setGreetingEs] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/organizations/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultLanguage: lang,
          aiGreetingEn: greetingEn || null,
          aiGreetingEs: greetingEs || null,
        }),
      });
      router.push("/onboarding/notifications");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <StepsIndicator current={3} />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0f172a] mb-1">
          Configure your AI receptionist
        </h2>
        <p className="text-sm text-[#64748b] mb-6">
          Customize how your AI greets customers. Leave blank to use smart
          defaults.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-2">
              Default language
            </label>
            <div className="flex gap-2">
              {(["AUTO", "EN", "ES"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                    lang === l
                      ? "bg-[#1b3a6b] text-white border-[#1b3a6b]"
                      : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1b3a6b]"
                  }`}
                >
                  {l === "AUTO" ? "🌐 Auto-detect" : l === "EN" ? "🇺🇸 English" : "🇲🇽 Spanish"}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#94a3b8] mt-1">
              Auto-detect responds in whichever language the customer uses.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              English greeting (optional)
            </label>
            <textarea
              rows={2}
              placeholder={`Default: "Thank you for calling [Business Name]. I'm your AI assistant…"`}
              value={greetingEn}
              onChange={(e) => setGreetingEn(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Spanish greeting (optional)
            </label>
            <textarea
              rows={2}
              placeholder={`Default: "Gracias por llamar a [Business Name]. Soy su asistente de IA…"`}
              value={greetingEs}
              onChange={(e) => setGreetingEs(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b3a6b] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#162e55] disabled:opacity-50 transition-colors mt-2"
          >
            {loading ? "Saving…" : "Continue →"}
          </button>
        </form>
      </div>
    </div>
  );
}
