export const metadata = {
  title: "Dispatcher Guide — Servin Tech Solutions",
};

export default function DispatcherGuidePage() {
  return (
    <div className="py-12 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wide">Documentation</span>
          <h1 className="text-3xl font-bold text-[#0f172a] mt-2 mb-3">Dispatcher Guide</h1>
          <p className="text-[#64748b]">How to use the Servin Tech Solutions dashboard as a dispatcher.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1b3a6b] text-white rounded-xl p-6">
            <h2 className="font-semibold mb-2">Your role as dispatcher</h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              You can view all leads, move them through the pipeline, and add notes. You don&apos;t
              have access to billing, AI configuration, or team management — those are owner-only.
              When a new lead comes in, you get an instant text or email with the key details.
            </p>
          </div>

          <Section title="Getting notified" icon="🔔">
            <p>
              If your phone number is in the notifications list, you&apos;ll get a text within
              60 seconds of every new lead. The text includes:
            </p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside">
              <li>Caller&apos;s phone number</li>
              <li>Job type and urgency (1–10)</li>
              <li>Service address</li>
              <li>A direct link to the lead in your dashboard</li>
            </ul>
            <p className="mt-3">
              You also receive a full email with all qualification details including budget range and preferred appointment time.
            </p>
          </Section>

          <Section title="Working the pipeline" icon="⟶">
            <p className="mb-3">
              The pipeline shows all active leads organized in columns. Drag a lead card to move it
              to the next stage as you work it.
            </p>
            <div className="space-y-2">
              {[
                { status: "New Lead", color: "#3b82f6", desc: "Just came in — needs a callback" },
                { status: "Contacted", color: "#8b5cf6", desc: "You've spoken with the customer" },
                { status: "Estimate Scheduled", color: "#f59e0b", desc: "Appointment booked to give an estimate" },
                { status: "Estimate Sent", color: "#f97316", desc: "Estimate sent — follow-ups fire automatically" },
                { status: "Won", color: "#10b981", desc: "Job confirmed — follow-ups stop" },
                { status: "Lost", color: "#94a3b8", desc: "Didn't convert — follow-ups stop" },
              ].map((s) => (
                <div key={s.status} className="flex items-center gap-3 py-2 border-b border-[#f1f5f9] last:border-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-sm font-medium text-[#0f172a] w-40 shrink-0">{s.status}</span>
                  <span className="text-sm text-[#64748b]">{s.desc}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Understanding a lead" icon="👤">
            <p className="mb-3">Click any lead to see the full detail view:</p>
            <div className="space-y-3">
              <InfoRow label="Qualification data" value="Job type, urgency score, address, budget range, preferred appointment — all collected by the AI before anyone picked up the phone." />
              <InfoRow label="Urgency score" value="1–10. Emergency (9–10) = no water, no heat, flooding. Urgent (7–8) = inconvenient but manageable. Normal (1–6) = maintenance." />
              <InfoRow label="Language badge" value="🇺🇸 EN or 🇲🇽 ES — shows which language the customer used. The AI responded in that language automatically." />
              <InfoRow label="Channel icon" value="📞 = phone call, 💬 = text message." />
              <InfoRow label="Transcript tab" value="Full conversation between the AI and the customer. Read it to understand exactly what was said before calling back." />
              <InfoRow label="Photos tab" value="Any photos the customer sent via text. Useful to see the issue before arriving." />
              <InfoRow label="Follow-ups tab" value="Shows the automated follow-up messages sent. Only fires when status is Estimate Sent." />
            </div>
          </Section>

          <Section title="Adding notes" icon="📝">
            <p>
              Open any lead → click the <strong>Notes</strong> field → type and save. Notes are
              visible to the whole team. Use them to track:
            </p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside">
              <li>What was said during the callback</li>
              <li>Quote amount given</li>
              <li>Follow-up date agreed with customer</li>
              <li>Any special instructions</li>
            </ul>
          </Section>

          <Section title="Tips for faster response" icon="⚡">
            <ul className="space-y-2.5 list-disc list-inside">
              <li>Call new leads within 5 minutes — conversion rates drop significantly after 30 minutes</li>
              <li>Check the urgency score first: 8+ should be called immediately</li>
              <li>Read the transcript before calling — you already know what the customer needs</li>
              <li>Move the lead to <em>Contacted</em> as soon as you speak with them — this stops the New Lead notification from repeating</li>
              <li>Move to <em>Won</em> or <em>Lost</em> promptly — this cancels any pending follow-up messages so customers don&apos;t get unwanted texts</li>
            </ul>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2 border-b border-[#f1f5f9] last:border-0">
      <span className="font-semibold text-[#0f172a]">{label}:</span>{" "}
      <span className="text-[#64748b]">{value}</span>
    </div>
  );
}
