import Link from "next/link";
import MarketingLayout from "./(marketing)/layout";

const FEATURES = [
  { icon: "📞", title: "Never miss a lead", desc: "Your AI answers every call and text instantly — 24/7, including after hours and weekends." },
  { icon: "🇲🇽", title: "Fully bilingual", desc: "Auto-detects Spanish or English and responds fluently in the customer's language." },
  { icon: "📋", title: "Qualify in seconds", desc: "Collects job type, urgency, address, photos, budget, and preferred appointment — before you pick up the phone." },
  { icon: "🔔", title: "Instant alerts", desc: "Get a text and email the moment a new lead comes in — with all the details already filled in." },
  { icon: "📨", title: "Automatic follow-ups", desc: "Estimates not converting? The AI follows up on Day 1, Day 3, and Day 7 automatically." },
  { icon: "⟶", title: "Simple CRM pipeline", desc: "Drag leads from New → Contacted → Estimate Sent → Won. No complicated software." },
];

const TRADES = ["HVAC", "Plumbing", "Roofing", "Electrical", "Pest Control", "Landscaping"];

export default function LandingPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="bg-[#1b3a6b] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Bilingual AI — English & Spanish
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Your AI receptionist for<br />home service contractors
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">
            Never miss a lead again. Your AI answers calls and texts 24/7 in English and Spanish,
            qualifies every prospect, and notifies you instantly — so you focus on the job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/sign-up" className="bg-white text-[#1b3a6b] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
              Start free — no credit card
            </Link>
            <Link href="/pricing" className="text-blue-200 hover:text-white text-sm font-medium transition-colors">
              See pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* Trades bar */}
      <section className="bg-white border-b border-[#e2e8f0] py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-xs text-[#94a3b8] font-medium uppercase tracking-wide">Built for</span>
          {TRADES.map((t) => <span key={t} className="text-sm text-[#64748b] font-medium">{t}</span>)}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0f172a] text-center mb-2">How it works</h2>
          <p className="text-sm text-[#64748b] text-center mb-10">Set up in 5 minutes. Live the same day.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "1", title: "Get your AI number", desc: "We provision a local phone number. Customers call or text it — or forward your existing number to it." },
              { n: "2", title: "AI qualifies every lead", desc: "Your AI receptionist answers, collects 6 key details, and asks for photos — in English or Spanish." },
              { n: "3", title: "You close more jobs", desc: "You get an instant alert with the full lead. Estimates that don't convert get followed up automatically." },
            ].map((step) => (
              <div key={step.n} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                <div className="w-8 h-8 rounded-full bg-[#1b3a6b] text-white flex items-center justify-center text-sm font-bold mb-3">{step.n}</div>
                <h3 className="text-sm font-semibold text-[#0f172a] mb-1.5">{step.title}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0f172a] text-center mb-10">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-5 rounded-xl border border-[#e2e8f0] hover:border-[#1b3a6b] transition-colors">
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
          <h2 className="text-2xl font-bold mb-3">Ready to stop missing leads?</h2>
          <p className="text-blue-200 text-sm mb-6">Free setup. Month-to-month. Cancel anytime.</p>
          <Link href="/sign-up" className="inline-block bg-white text-[#1b3a6b] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
            Get started free →
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
