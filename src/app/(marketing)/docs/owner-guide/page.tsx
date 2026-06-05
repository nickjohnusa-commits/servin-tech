export const metadata = {
  title: "Owner Guide — Servin Tech Solutions",
};

export default function OwnerGuidePage() {
  return (
    <div className="py-12 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wide">Documentation</span>
          <h1 className="text-3xl font-bold text-[#0f172a] mt-2 mb-3">Owner Guide</h1>
          <p className="text-[#64748b]">Everything you need to manage your AI reception system.</p>
        </div>

        <div className="space-y-6">
          <Section title="Getting started" icon="🚀">
            <p>After signing up, you&apos;ll be guided through a 5-step onboarding wizard:</p>
            <ol className="mt-3 space-y-2 list-decimal list-inside">
              {[
                "Enter your business name and timezone",
                "Get your AI reception phone number — give this to customers or forward your main number to it",
                "Set your AI greeting in English and/or Spanish",
                "Add email addresses and phone numbers to receive instant lead alerts",
                "Choose your subscription plan",
              ].map((s) => <li key={s} className="text-[#64748b]">{s}</li>)}
            </ol>
          </Section>

          <Section title="Managing your pipeline" icon="⟶">
            <FeatureRow title="Dashboard" desc="See leads today, this week, conversion rate, and pipeline status at a glance." />
            <FeatureRow title="Leads list" desc="Full filterable list by status, language (EN/ES), job type, and search by phone or name." />
            <FeatureRow title="Lead detail" desc="View the full qualification data, AI call transcript, photos the customer sent, and follow-up history. Add private notes." />
            <FeatureRow title="Pipeline (kanban)" desc="Drag leads between columns: New Lead → Contacted → Estimate Scheduled → Estimate Sent → Won / Lost." />
          </Section>

          <Section title="AI settings" icon="🤖">
            <p className="mb-3">Go to <strong>Settings → AI Config</strong> to:</p>
            <ul className="space-y-2 list-disc list-inside text-[#64748b]">
              <li>Change the default language (Auto-detect, English only, or Spanish only)</li>
              <li>Write a custom English greeting — or leave blank for the smart default</li>
              <li>Write a custom Spanish greeting — or leave blank for the smart default</li>
            </ul>
            <p className="mt-3 text-xs text-[#94a3b8]">Changes take effect on the next incoming call or text.</p>
          </Section>

          <Section title="Notifications" icon="🔔">
            <p>Go to <strong>Settings → Notifications</strong> to add or remove:</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-[#64748b]">
              <li><strong>Email addresses</strong> — receive a formatted email with all lead details within 60 seconds of every new inquiry</li>
              <li><strong>Phone numbers</strong> — receive a text with a brief summary and a link to the lead in your dashboard</li>
            </ul>
          </Section>

          <Section title="Automatic follow-ups" icon="📨">
            <p>Go to <strong>Settings → Follow-ups</strong> to configure the automated follow-up sequence that fires when a lead is marked <em>Estimate Sent</em>:</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-[#64748b]">
              <li>Enable or disable follow-ups entirely</li>
              <li>Set the timing: default is Day 1 SMS, Day 3 Email+SMS, Day 7 final SMS</li>
              <li>Follow-ups stop automatically the moment a lead is marked Won or Lost</li>
            </ul>
          </Section>

          <Section title="Team management" icon="👥">
            <p>Go to <strong>Settings → Team</strong> to invite dispatchers. They receive an email invitation and get a limited account with access to:</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { label: "Can access", items: ["Dashboard", "Leads list", "Lead detail", "Pipeline (move leads)", "Add notes"] },
                { label: "Cannot access", items: ["AI settings", "Notification settings", "Follow-up settings", "Team management", "Billing"] },
              ].map((col) => (
                <div key={col.label} className={`p-3 rounded-lg border ${col.label === "Can access" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <p className={`text-xs font-semibold mb-2 ${col.label === "Can access" ? "text-green-700" : "text-red-700"}`}>{col.label}</p>
                  <ul className="space-y-1">
                    {col.items.map((i) => <li key={i} className="text-xs text-[#64748b] flex items-center gap-1.5">
                      <span>{col.label === "Can access" ? "✓" : "✗"}</span>{i}
                    </li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Testing before going live" icon="🧪">
            <p>Go to <strong>Test</strong> in the sidebar to:</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-[#64748b]">
              <li>Toggle Test Mode on/off — when ON, all leads are isolated and won&apos;t appear in your real pipeline</li>
              <li>Send a simulated text message and see the AI reply in real-time</li>
              <li>Call your provisioned AI number from your actual phone to hear the full voice experience</li>
              <li>View all test leads in one place</li>
            </ul>
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Always test before going live. Flip Test Mode OFF only when you&apos;re confident the AI is working correctly.
            </p>
          </Section>

          <Section title="Monthly reports" icon="📊">
            <p>On the 1st of each month, a report is automatically emailed to all notification email addresses. It includes:</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-[#64748b]">
              <li>Total leads for the month</li>
              <li>Jobs won and conversion rate</li>
              <li>Breakdown by voice vs. text, English vs. Spanish</li>
              <li>Top job type</li>
            </ul>
            <p className="mt-3">Past reports are also available under <strong>Reports</strong> in the sidebar.</p>
          </Section>
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
      <div className="px-6 py-5 text-sm text-[#64748b] leading-relaxed">{children}</div>
    </div>
  );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="py-2.5 border-b border-[#f1f5f9] last:border-0">
      <span className="font-semibold text-[#0f172a]">{title}</span>
      <span className="text-[#64748b]"> — {desc}</span>
    </div>
  );
}
