import Link from "next/link";
import { PLANS } from "@/lib/stripe/client";

export const metadata = {
  title: "Pricing — Servin Tech Solutions",
  description: "Simple monthly pricing for home service contractors. Free to start.",
};

export default function PricingPage() {
  const plans = Object.entries(PLANS) as [keyof typeof PLANS, (typeof PLANS)[keyof typeof PLANS]][];

  return (
    <div className="py-16 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-3">
            Simple, transparent pricing
          </h1>
          <p className="text-[#64748b] max-w-xl mx-auto">
            Free setup. Month-to-month. Cancel anytime. Most contractors recoup the
            cost with their first converted lead.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map(([key, plan]) => {
            const isPopular = key === "PROFESSIONAL";
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
                      Most popular
                    </span>
                  </div>
                )}
                <h2 className="text-lg font-bold text-[#0f172a] mb-1">{plan.name}</h2>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-[#0f172a]">${plan.price}</span>
                  <span className="text-[#64748b] text-sm">/month</span>
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
                  Get started
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8">
          <h2 className="text-lg font-bold text-[#0f172a] mb-6 text-center">
            Frequently asked questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How long does setup take?",
                a: "Under 10 minutes. You get a real phone number, configure your AI greeting, and set up notifications — all from the onboarding wizard.",
              },
              {
                q: "Does the AI really speak Spanish?",
                a: "Yes. Your AI automatically detects the caller's language and responds fluently in English or Spanish — no setup required.",
              },
              {
                q: "What happens to my current phone number?",
                a: "You can keep it. Just forward your existing number to your new AI number, or share the new number directly with customers.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Month-to-month, no contracts. Cancel from your billing settings at any time.",
              },
              {
                q: "How many leads can I receive?",
                a: "Unlimited on all plans. There are no per-call or per-lead charges beyond your monthly subscription.",
              },
              {
                q: "Is there a free trial?",
                a: "Setup is free and you can test the full system before going live. Your subscription starts when you choose a plan.",
              },
            ].map((faq) => (
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
