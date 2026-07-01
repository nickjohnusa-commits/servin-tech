import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email_addresses: { email_address: string }[];
  };
};

type ClerkOrgCreatedEvent = {
  type: "organization.created";
  data: {
    id: string;
    name: string;
    slug: string;
    created_by: string;
  };
};

type ClerkMembershipCreatedEvent = {
  type: "organizationMembership.created";
  data: {
    organization: { id: string };
    public_user_data: { user_id: string };
    role: string;
  };
};

type ClerkMembershipDeletedEvent = {
  type: "organizationMembership.deleted";
  data: {
    organization: { id: string };
    public_user_data: { user_id: string };
  };
};

type WebhookEvent =
  | ClerkUserCreatedEvent
  | ClerkOrgCreatedEvent
  | ClerkMembershipCreatedEvent
  | ClerkMembershipDeletedEvent;

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event: WebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    switch (event.type) {
      case "user.created":
        // User row is created on membership event — nothing to do here
        break;

      case "organization.created": {
        const { id, name, slug } = event.data;
        await db.organization.upsert({
          where: { clerkOrgId: id },
          create: { clerkOrgId: id, name, slug, businessName: name },
          update: { name, slug },
        });
        break;
      }

      case "organizationMembership.created": {
        const { organization, public_user_data, role } = event.data;
        const org = await db.organization.findUnique({
          where: { clerkOrgId: organization.id },
        });
        if (!org) break;

        await db.user.upsert({
          where: { clerkUserId: public_user_data.user_id },
          create: {
            clerkUserId: public_user_data.user_id,
            organizationId: org.id,
            role: role === "org:admin" ? "OWNER" : "DISPATCHER",
            name: public_user_data.user_id,
            email: "",
          },
          update: {
            organizationId: org.id,
            role: role === "org:admin" ? "OWNER" : "DISPATCHER",
          },
        });
        break;
      }

      case "organizationMembership.deleted": {
        const { public_user_data } = event.data;
        await db.user
          .delete({ where: { clerkUserId: public_user_data.user_id } })
          .catch(() => null);
        break;
      }
    }
  } catch (err) {
    console.error("[clerk/webhook] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
