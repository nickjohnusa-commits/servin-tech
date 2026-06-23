"use client";

import Link from "next/link";
import { useLang } from "@/components/marketing/language-provider";
import { t } from "@/lib/i18n";
import { PLANS } from "@/lib/stripe/client";

const PLAN_KEYS = Object.keys(PLANS) as (keyof typeof PLANS)[];
const PRICES: Record<keyof typeof PLANS, number> = {
  STARTER: PLANS.STARTER.price,
  PROFESSIONAL: PLANS.PROFESSIONAL.price,
  AGENCY: PLANS.AGENCY.price,
};

export default function PricingPage() {
  const { lang } = useLang();
  const tx = t.pricing[lang];

  return (
    <div className="py-16 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-3">{tx.h1}</h1>
          <p className="text-[#64748b] max-w-xl mx-auto">{tx.sub}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLAN_KEYS.map((key) => {
            const isPopular = key === "PROFESSIONAL";
            const plan = tx.plans[key];
            return (
              <div
                key={key}
                className={`bg-white rounded-2xl p-7 flex flex-col ${
                  isPopular
                    ? "border-2 border-[#1b3a6b] shadow-lg"
                    : "border border-[#e2e8f0]"
                }`}
              >
                {isPopular && (
                  <div className="text-center mb-4">
                    <span className="bg-[#1b3a6b] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {tx.popular}
                    </span>
                  </div>
                )}
                <h2 className="text-lg font-bold text-[#0f172a] mb-1">{plan.name}</h2>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-[#0f172a]">${PRICES[key]}</span>
                  <span className="text-[#64748b] text-sm">{tx.perMonth}</span>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#64748b]">
                      <span className="text-[#10b981] mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isPopular
                      ? "bg-[#1b3a6b] text-white hover:bg-[#162e55]"
                      : "border border-[#e2e8f0] text-[#0f172a] hover:border-[#1b3a6b] hover:text-[#1b3a6b]"
                  }`}
                >
                  {tx.getStarted}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8">
          <h2 className="text-lg font-bold text-[#0f172a] mb-6 text-center">{tx.faqTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tx.faqs.map((faq) => (
              <div key={faq.q}>
                <p className="text-sm font-semibold text-[#0f172a] mb-1">{faq.q}</p>
                <p className="text-xs text-[#64748b] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
