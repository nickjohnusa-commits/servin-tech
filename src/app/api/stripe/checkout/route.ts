import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe, PLANS } from "@/lib/stripe/client";
import { z } from "zod";

const schema = z.object({
  tier: z.enum(["STARTER", "PROFESSIONAL", "AGENCY"]),
});

export async function POST(req: Request) {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (orgRole !== "org:admin")
    return NextResponse.json({ error: "Owner only" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const plan = PLANS[parsed.data.tier];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  let customerId = org.stripeCustomerId;
  if (!customerId) {
    const user = await db.user.findFirst({ where: { organizationId: org.id, role: "OWNER" } });
    const customer = await stripe.customers.create({
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

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?subscribed=true`,
    cancel_url: `${appUrl}/onboarding/subscribe`,
    metadata: { orgId: org.id, tier: parsed.data.tier },
  });

  return NextResponse.json({ url: session.url });
}
