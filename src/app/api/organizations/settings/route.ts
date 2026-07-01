import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSameOrigin, csrfError } from "@/lib/csrf";
import { z } from "zod";

const schema = z.object({
  businessName: z.string().min(1).optional(),
  timezone: z.string().optional(),
  defaultLanguage: z.enum(["EN", "ES", "AUTO"]).optional(),
  aiGreetingEn: z.string().nullable().optional(),
  aiGreetingEs: z.string().nullable().optional(),
  notificationEmails: z.array(z.string().email()).optional(),
  notificationPhones: z.array(z.string()).optional(),
  followUpEnabled: z.boolean().optional(),
  followUpDays: z.array(z.number().min(1).max(30)).optional(),
  testMode: z.boolean().optional(),
});

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
    if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(org);
  } catch (err) {
    console.error("[settings/GET] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isSameOrigin(req)) return csrfError();
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (orgRole !== "org:admin")
    return NextResponse.json({ error: "Owner only" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const org = await db.organization.update({
      where: { clerkOrgId: orgId },
      data: parsed.data,
    });
    return NextResponse.json(org);
  } catch (err) {
    console.error("[settings/PATCH] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
