import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { stripe, PLANS } from "@/lib/stripe/client";
import Link from "next/link";

export default async function SettingsBillingPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  let portalUrl: string | null = null;
  if (org.stripeCustomerId) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: org.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
      });
      portalUrl = session.url;
    } catch {
      // Portal not configured yet — show manual upgrade link
    }
  }

  const plan = PLANS[org.subscriptionTier as keyof typeof PLANS];
  const statusColor =
    org.subscriptionStatus === "ACTIVE" ? "text-green-700 bg-green-50 border-green-200"
    : org.subscriptionStatus === "TRIALING" ? "text-amber-700 bg-amber-50 border-amber-200"
    : "text-red-700 bg-red-50 border-red-200";

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Current plan */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Current plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[#0f172a]">{plan?.name ?? "—"}</p>
            <p className="text-sm text-[#64748b]">${plan?.price ?? 0}/month</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor}`}>
            {org.subscriptionStatus.toLowerCase().replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Billing portal or upgrade CTA */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Billing management</h2>
        <p className="text-xs text-[#64748b] mb-4">
          Update payment method, download invoices, or cancel your subscription.
        </p>
        {portalUrl ? (
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#1b3a6b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162e55] transition-colors"
          >
            Manage billing →
          </a>
        ) : (
          <div>
            <p className="text-xs text-[#94a3b8] mb-3">
              No active subscription found.
            </p>
            <Link
              href="/onboarding/subscribe"
              className="inline-block bg-[#1b3a6b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162e55] transition-colors"
            >
              Choose a plan →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
