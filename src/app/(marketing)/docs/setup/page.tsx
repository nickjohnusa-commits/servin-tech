export const metadata = {
  title: "Setup Guide — Servin Tech Solutions",
};

export default function SetupGuidePage() {
  return (
    <div className="py-12 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wide">Documentation</span>
          <h1 className="text-3xl font-bold text-[#0f172a] mt-2 mb-3">Setup & Installation Guide</h1>
          <p className="text-[#64748b]">
            Everything you need to get your AI receptionist live. Most contractors finish in under 15 minutes.
          </p>
        </div>

        <div className="space-y-6">
          <DocSection title="Prerequisites" icon="✅">
            <p>Before you start, create free accounts at each service below. You&apos;ll collect API keys during account setup — keep them handy.</p>
            <table className="w-full mt-4 text-sm border-collapse">
              <thead>
                <tr className="bg-[#f1f5f9]">
                  <th className="text-left px-4 py-2 font-semibold text-[#0f172a] rounded-tl-lg">Service</th>
                  <th className="text-left px-4 py-2 font-semibold text-[#0f172a]">Purpose</th>
                  <th className="text-left px-4 py-2 font-semibold text-[#0f172a] rounded-tr-lg">URL</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Supabase", "Database + file storage", "supabase.com"],
                  ["Clerk", "Authentication + team management", "clerk.com"],
                  ["Twilio", "Phone numbers + SMS", "twilio.com"],
                  ["OpenAI", "AI voice and text", "platform.openai.com"],
                  ["Stripe", "Monthly subscriptions", "stripe.com"],
                  ["Resend", "Email notifications", "resend.com"],
                  ["Inngest", "Background jobs", "inngest.com"],
                  ["Vercel", "Web app hosting", "vercel.com"],
                  ["Railway", "Voice server hosting", "railway.app"],
                ].map(([svc, purpose, url]) => (
                  <tr key={svc} className="border-t border-[#e2e8f0]">
                    <td className="px-4 py-2.5 font-medium text-[#0f172a]">{svc}</td>
                    <td className="px-4 py-2.5 text-[#64748b]">{purpose}</td>
                    <td className="px-4 py-2.5 text-[#2563eb] text-xs">{url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DocSection>

          <DocSection title="Step 1 — Supabase (database)" icon="🗄️">
            <Steps steps={[
              "Go to supabase.com → New Project. Choose a region close to your users.",
              "Settings → Database → Connection string → copy the Transaction string → paste as DATABASE_URL in .env.local",
              "Copy the Session string → paste as DIRECT_URL",
              "Settings → API → copy URL → SUPABASE_URL. Copy anon key → SUPABASE_ANON_KEY",
              "Run: pnpm db:migrate:dev — this creates all tables",
            ]} />
          </DocSection>

          <DocSection title="Step 2 — Clerk (auth)" icon="🔐">
            <Steps steps={[
              "Go to clerk.com → Create Application. Enable Email + Password and Google OAuth.",
              "Enable Organizations in Dashboard → Organizations.",
              "API Keys → copy Publishable key → NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. Copy Secret key → CLERK_SECRET_KEY",
              "Webhooks → Add Endpoint: https://your-domain.com/api/webhooks/clerk — Events: user.created, organization.created, organizationMembership.created, organizationMembership.deleted",
              "Copy webhook signing secret → CLERK_WEBHOOK_SECRET",
            ]} />
          </DocSection>

          <DocSection title="Step 3 — Twilio (phone)" icon="📞">
            <Steps steps={[
              "Go to console.twilio.com → Create Account. Copy Account SID → TWILIO_ACCOUNT_SID. Copy Auth Token → TWILIO_AUTH_TOKEN",
              "Testing → Test Credentials → copy test SID and token → TWILIO_TEST_ACCOUNT_SID / TWILIO_TEST_AUTH_TOKEN (used in test mode)",
              "Individual phone numbers are provisioned per contractor during their onboarding — no numbers needed now.",
            ]} />
          </DocSection>

          <DocSection title="Step 4 — OpenAI" icon="🤖">
            <Steps steps={[
              "Go to platform.openai.com → API Keys → Create new secret key → paste as OPENAI_API_KEY",
              "Ensure your account has access to gpt-4o-realtime-preview (requires Tier 1+ usage, approximately $5 in prior API spend)",
            ]} />
          </DocSection>

          <DocSection title="Step 5 — Stripe (billing)" icon="💳">
            <Steps steps={[
              "Dashboard → Developers → API Keys → copy Secret key → STRIPE_SECRET_KEY. Copy Publishable key → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
              "Products → Add Product → create three recurring products: Starter $149/mo, Professional $299/mo, Agency $499/mo",
              "Copy each price ID → STRIPE_PRICE_STARTER, STRIPE_PRICE_PROFESSIONAL, STRIPE_PRICE_AGENCY",
              "Developers → Webhooks → Add Endpoint: https://your-domain.com/api/webhooks/stripe — Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted",
              "Copy webhook signing secret → STRIPE_WEBHOOK_SECRET",
            ]} />
          </DocSection>

          <DocSection title="Step 6 — Resend (email)" icon="✉️">
            <Steps steps={[
              "resend.com → API Keys → Create → paste as RESEND_API_KEY",
              "Domains → Add your sending domain and add the DNS records provided. Set RESEND_FROM_EMAIL=noreply@yourdomain.com",
            ]} />
          </DocSection>

          <DocSection title="Step 7 — Inngest (background jobs)" icon="⚙️">
            <Steps steps={[
              "inngest.com → Create App → Event Keys → copy → INNGEST_EVENT_KEY",
              "Signing Keys → copy → INNGEST_SIGNING_KEY",
              "After deploying, register your app URL: https://your-domain.com/api/webhooks/inngest",
            ]} />
          </DocSection>

          <DocSection title="Step 8 — Deploy voice server to Railway" icon="🚀">
            <Steps steps={[
              "Install Railway CLI: npm install -g railway",
              "cd voice-server && railway login && railway init → select New Project",
              "Set env vars: OPENAI_API_KEY, INTERNAL_API_SECRET (generate with: openssl rand -hex 32), NEXT_APP_URL",
              "railway up — Railway assigns a wss:// URL",
              "Copy the URL → VOICE_SERVER_URL=wss://your-voice-server.up.railway.app in your Vercel env vars",
            ]} />
          </DocSection>

          <DocSection title="Step 9 — Deploy web app to Vercel" icon="▲">
            <Steps steps={[
              "Push your code to GitHub",
              "vercel.com → Add New Project → Import your repo",
              "Add all environment variables from .env.example in Vercel → Settings → Environment Variables",
              "Deploy. Copy your production URL → NEXT_PUBLIC_APP_URL",
              "Update Clerk, Twilio, Stripe, and Inngest webhooks to use the production URL",
            ]} />
          </DocSection>

          <DocSection title="Step 10 — Go live" icon="✅">
            <Steps steps={[
              "Sign up at your production URL, complete the 5-step onboarding",
              "Go to /test → run a simulated SMS to verify the AI responds correctly",
              "Call your provisioned AI number from your phone to test the voice flow",
              "Check /test → verify the lead appears with all qualification data",
              "Flip Test Mode OFF in /test → your AI is now live",
            ]} />
          </DocSection>
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
