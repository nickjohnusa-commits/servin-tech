import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  orgId: z.string(),
  callSid: z.string(),
  callerPhone: z.string(),
  callerName: z.string().optional(),
  transcript: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      timestamp: z.string(),
    })
  ),
  qualificationData: z.object({
    jobType: z.string().optional(),
    urgency: z.number().optional(),
    address: z.string().optional(),
    budgetRange: z.string().optional(),
    preferredAppointment: z.string().optional(),
  }),
  durationSecs: z.number().optional(),
  languageDetected: z.enum(["EN", "ES"]).default("EN"),
  aiSummary: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`call-complete:${ip}`, 60)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const secret = req.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    orgId,
    callSid,
    callerPhone,
    callerName,
    transcript,
    qualificationData,
    durationSecs,
    languageDetected,
    aiSummary,
  } = parsed.data;

  try {
    const org = await db.organization.findUnique({ where: { id: orgId } });
    if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

    // Avoid duplicate leads from the same call
    const existing = await db.conversation.findUnique({ where: { callSid } });
    if (existing) {
      return NextResponse.json({ leadId: existing.leadId, duplicate: true });
    }

    const lead = await db.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          organizationId: orgId,
          callerPhone,
          callerName,
          channel: "VOICE",
          languageDetected,
          jobType: qualificationData.jobType,
          urgency: qualificationData.urgency,
          address: qualificationData.address,
          budgetRange: qualificationData.budgetRange,
          preferredAppointment: qualificationData.preferredAppointment,
          aiSummary,
          testLead: org.testMode,
        },
      });

      await tx.conversation.create({
        data: {
          leadId: newLead.id,
          organizationId: orgId,
          channel: "VOICE",
          transcript,
          durationSecs,
          callSid,
        },
      });

      return newLead;
    });

    await inngest.send({
      name: "lead/created",
      data: { leadId: lead.id, organizationId: orgId },
    });

    return NextResponse.json({ leadId: lead.id });
  } catch (err) {
    console.error("[call-complete] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
