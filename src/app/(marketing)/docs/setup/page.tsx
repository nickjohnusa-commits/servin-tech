"use client";

import { useLang } from "@/components/marketing/language-provider";
import { docsContent, type StepItem } from "@/lib/docs-content";

export default function SetupGuidePage() {
  const { lang } = useLang();
  const tx = docsContent[lang];

  return (
    <div className="py-12 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wide">{tx.label}</span>
          <h1 className="text-3xl font-bold text-[#0f172a] mt-2 mb-3">{tx.h1}</h1>
          <p className="text-[#64748b]">{tx.sub}</p>
        </div>

        <div className="space-y-6">

          {/* Prerequisites table */}
          <Section title={tx.prereqTitle} icon="✅">
            <p className="mb-4 text-sm text-[#64748b]">{tx.prereqIntro}</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f1f5f9]">
                  {tx.tableHeaders.map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 font-semibold text-[#0f172a]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tx.services.map(([svc, purpose, url]) => (
                  <tr key={svc} className="border-t border-[#e2e8f0]">
                    <td className="px-4 py-2.5 font-medium text-[#0f172a]">{svc}</td>
                    <td className="px-4 py-2.5 text-[#64748b]">{purpose}</td>
                    <td className="px-4 py-2.5">
                      <a href={`https://${url}`} target="_blank" rel="noopener noreferrer"
                        className="text-[#2563eb] hover:underline text-xs">{url}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Steps */}
          {tx.steps.map((step) => (
            <Section key={step.title} title={step.title} icon={step.icon}>
              {step.intro && (
                <p className="text-sm text-[#64748b] mb-5 leading-relaxed border-l-2 border-[#1b3a6b] pl-3">
                  {step.intro}
                </p>
              )}
              <ol className="space-y-4">
                {step.items.map((item, i) => (
                  <StepRow key={i} index={i} item={item} />
                ))}
              </ol>
            </Section>
          ))}

        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-4 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-semibold text-[#0f172a]">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function StepRow({ index, item }: { index: number; item: StepItem }) {
  const hasNumber = !!item.text;
  return (
    <li className="space-y-2">
      {item.text && (
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-5 h-5 rounded-full bg-[#1b3a6b] text-white text-xs flex items-center justify-center font-semibold mt-0.5">
            {index + 1}
          </span>
          <span className="text-sm text-[#374151] leading-relaxed">{item.text}</span>
        </div>
      )}
      {item.code && (
        <div className={hasNumber ? "ml-8" : ""}>
          <pre className="bg-[#0f172a] text-[#e2e8f0] text-xs rounded-lg px-4 py-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {item.code}
          </pre>
        </div>
      )}
      {item.note && (
        <div className={`flex items-start gap-2 bg-[#eff6ff] border border-[#bfdbfe] rounded-lg px-3 py-2.5 ${hasNumber ? "ml-8" : ""}`}>
          <span className="text-[#2563eb] text-xs mt-0.5 shrink-0">💡</span>
          <p className="text-xs text-[#1d4ed8] leading-relaxed">{item.note}</p>
        </div>
      )}
      {item.warn && (
        <div className={`flex items-start gap-2 bg-[#fff7ed] border border-[#fed7aa] rounded-lg px-3 py-2.5 ${hasNumber ? "ml-8" : ""}`}>
          <span className="text-[#ea580c] text-xs mt-0.5 shrink-0">⚠️</span>
          <p className="text-xs text-[#9a3412] leading-relaxed">{item.warn}</p>
        </div>
      )}
    </li>
  );
}
