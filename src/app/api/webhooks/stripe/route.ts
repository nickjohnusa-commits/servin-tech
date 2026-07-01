import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Misconfigured" }, { status: 500 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.orgId;
      const tier = session.metadata?.tier as "STARTER" | "PROFESSIONAL" | "AGENCY";

      if (orgId && tier) {
        await db.organization.update({
          where: { id: orgId },
          data: {
            subscriptionStatus: "ACTIVE",
            subscriptionTier: tier,
            stripeSubscriptionId: session.subscription as string,
            onboardingComplete: true,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const org = await db.organization.findFirst({
        where: { stripeSubscriptionId: sub.id },
      });
      if (org) {
        await db.organization.update({
          where: { id: org.id },
          data: {
            subscriptionStatus: sub.status.toUpperCase() as "ACTIVE" | "PAST_DUE" | "CANCELED" | "PAUSED",
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const org = await db.organization.findFirst({
        where: { stripeSubscriptionId: sub.id },
      });
      if (org) {
        await db.organization.update({
          where: { id: org.id },
          data: { subscriptionStatus: "CANCELED" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
