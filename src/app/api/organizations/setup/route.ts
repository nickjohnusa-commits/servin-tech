import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSameOrigin, csrfError } from "@/lib/csrf";
import { z } from "zod";

const schema = z.object({
  businessName: z.string().min(1),
  timezone: z.string().min(1),
  areaCode: z.string().optional(),
});

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return csrfError();
  const { userId, orgId } = await auth();
  if (!userId || !orgId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { businessName, timezone } = parsed.data;

  try {
    await db.organization.update({
      where: { clerkOrgId: orgId },
      data: { businessName, timezone },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[setup/POST] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
