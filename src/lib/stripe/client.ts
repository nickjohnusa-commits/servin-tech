import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export const PLANS = {
  STARTER: {
    name: "Starter",
    priceId: process.env.STRIPE_PRICE_STARTER!,
    price: 149,
    features: [
      "1 AI phone number",
      "Unlimited inbound calls & texts",
      "Bilingual EN/ES AI",
      "Lead qualification",
      "Instant notifications",
      "CRM pipeline",
      "Monthly reports",
    ],
  },
  PROFESSIONAL: {
    name: "Professional",
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL!,
    price: 299,
    features: [
      "Everything in Starter",
      "Up to 3 team members",
      "Custom AI greeting scripts",
      "Advanced follow-up sequences",
      "Priority support",
    ],
  },
  AGENCY: {
    name: "Agency",
    priceId: process.env.STRIPE_PRICE_AGENCY!,
    price: 499,
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "White-label reports",
      "Dedicated account manager",
      "Custom integrations",
    ],
  },
} as const;
