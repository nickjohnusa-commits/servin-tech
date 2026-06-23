"use client";

import Link from "next/link";
import { useLang } from "./language-provider";
import { t } from "@/lib/i18n";

export function LandingContent() {
  const { lang } = useLang();
  const tx = t[lang];

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1b3a6b] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {tx.hero.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            {tx.hero.h1a}<br />{tx.hero.h1b}
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">
            {tx.hero.sub}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/sign-up" className="bg-white text-[#1b3a6b] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
              {tx.hero.cta}
            </Link>
            <Link href="/pricing" className="text-blue-200 hover:text-white text-sm font-medium transition-colors">
              {tx.hero.seePricing}
            </Link>
          </div>
        </div>
      </section>

      {/* Trades bar */}
      <section className="bg-white border-b border-[#e2e8f0] py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-xs text-[#94a3b8] font-medium uppercase tracking-wide">
            {tx.trades.label}
          </span>
          {tx.trades.items.map((trade) => (
            <span key={trade} className="text-sm text-[#64748b] font-medium">{trade}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0f172a] text-center mb-2">{tx.howItWorks.h2}</h2>
          <p className="text-sm text-[#64748b] text-center mb-10">{tx.howItWorks.sub}</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tx.howItWorks.steps.map((step, i) => {
              const isFirst = i === 0;
              const card = (
                <div className={`bg-white border rounded-xl p-6 h-full transition-colors ${isFirst ? "border-[#1b3a6b] hover:bg-[#f0f4ff]" : "border-[#e2e8f0]"}`}>
                  <div className="w-8 h-8 rounded-full bg-[#1b3a6b] text-white flex items-center justify-center text-sm font-bold mb-3">
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-semibold text-[#0f172a] mb-1.5">{step.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
                  {isFirst && (
                    <span className="inline-block mt-3 text-xs text-[#1b3a6b] font-medium">
                      {lang === "es" ? "Ver Guía →" : "View Docs →"}
                    </span>
                  )}
                </div>
              );
              return isFirst ? (
                <Link key={i} href="/docs/setup" className="block h-full">
                  {card}
                </Link>
              ) : (
                <div key={i} className="h-full">{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0f172a] text-center mb-10">{tx.features.h2}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {tx.features.items.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-[#e2e8f0] hover:border-[#1b3a6b] transition-colors">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold text-[#0f172a] mb-1.5">{f.title}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#1b3a6b] text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">{tx.cta.h2}</h2>
          <p className="text-blue-200 text-sm mb-6">{tx.cta.sub}</p>
          <Link href="/sign-up" className="inline-block bg-white text-[#1b3a6b] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
            {tx.cta.btn}
          </Link>
        </div>
      </section>
    </>
  );
}
