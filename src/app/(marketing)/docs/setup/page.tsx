"use client";

import { useLang } from "@/components/marketing/language-provider";
import { t } from "@/lib/i18n";

export default function SetupGuidePage() {
  const { lang } = useLang();
  const tx = t.docs[lang];

  return (
    <div className="py-12 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wide">{tx.label}</span>
          <h1 className="text-3xl font-bold text-[#0f172a] mt-2 mb-3">{tx.h1}</h1>
          <p className="text-[#64748b]">{tx.sub}</p>
        </div>

        <div className="space-y-6">
          {/* Prerequisites */}
          <DocSection title={tx.prereqTitle} icon="✅">
            <p>{tx.prereqIntro}</p>
            <table className="w-full mt-4 text-sm border-collapse">
              <thead>
                <tr className="bg-[#f1f5f9]">
                  {tx.tableHeaders.map((h) => (
                    <th key={h} className="text-left px-4 py-2 font-semibold text-[#0f172a]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tx.services.map(([svc, purpose, url]) => (
                  <tr key={svc} className="border-t border-[#e2e8f0]">
                    <td className="px-4 py-2.5 font-medium text-[#0f172a]">{svc}</td>
                    <td className="px-4 py-2.5 text-[#64748b]">{purpose}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <a
                        href={`https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563eb] hover:underline"
                      >
                        {url}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DocSection>

          {/* Steps */}
          {tx.steps.map((step) => (
            <DocSection key={step.title} title={step.title} icon={step.icon}>
              <Steps steps={[...step.items]} />
            </DocSection>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-4 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-semibold text-[#0f172a]">{title}</h2>
      </div>
      <div className="px-6 py-5 text-sm text-[#64748b] leading-relaxed">{children}</div>
    </div>
  );
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-2.5 list-none">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="shrink-0 w-5 h-5 rounded-full bg-[#1b3a6b] text-white text-xs flex items-center justify-center font-semibold mt-0.5">
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}
