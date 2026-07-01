import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripe, PLANS } from "@/lib/stripe/client";
import { isSameOrigin, csrfError } from "@/lib/csrf";
import { z } from "zod";

const schema = z.object({
  tier: z.enum(["STARTER", "PROFESSIONAL", "AGENCY"]),
});

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return csrfError();
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (orgRole !== "org:admin")
    return NextResponse.json({ error: "Owner only" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  try {
    const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
    if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const plan = PLANS[parsed.data.tier];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    let customerId = org.stripeCustomerId;
    if (!customerId) {
      const user = await db.user.findFirst({ where: { organizationId: org.id, role: "OWNER" } });
      const customer = await getStripe().customers.create({
        name: org.businessName,
        email: user?.email,
        metadata: { orgId: org.id, clerkOrgId: orgId },
      });
      customerId = customer.id;
      await db.organization.update({
        where: { id: org.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?subscribed=true`,
      cancel_url: `${appUrl}/onboarding/subscribe`,
      metadata: { orgId: org.id, tier: parsed.data.tier },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
