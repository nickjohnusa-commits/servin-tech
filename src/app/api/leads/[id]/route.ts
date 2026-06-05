import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest/client";
import { z } from "zod";

const schema = z.object({
  status: z
    .enum(["NEW", "CONTACTED", "ESTIMATE_SCHEDULED", "ESTIMATE_SENT", "WON", "LOST"])
    .optional(),
  notes: z.string().nullable().optional(),
  jobType: z.string().nullable().optional(),
  urgency: z.number().min(1).max(10).nullable().optional(),
  address: z.string().nullable().optional(),
  budgetRange: z.string().nullable().optional(),
  preferredAppointment: z.string().nullable().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await params;
  const lead = await db.lead.findFirst({
    where: { id, organizationId: org.id },
    include: { conversations: true, followUps: true },
  });

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await params;
  const existing = await db.lead.findFirst({ where: { id, organizationId: org.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const lead = await db.lead.update({
    where: { id },
    data: parsed.data,
  });

  // Fire follow-up sequence when status moves to ESTIMATE_SENT
  if (
    parsed.data.status === "ESTIMATE_SENT" &&
    existing.status !== "ESTIMATE_SENT"
  ) {
    await inngest.send({
      name: "lead/estimate-sent",
      data: { leadId: lead.id, organizationId: org.id },
    });
  }

  // Cancel follow-ups if WON or LOST
  if (parsed.data.status === "WON" || parsed.data.status === "LOST") {
    await db.followUp.updateMany({
      where: { leadId: id, status: "PENDING" },
      data: { status: "CANCELED" },
    });
  }

  return NextResponse.json(lead);
}
