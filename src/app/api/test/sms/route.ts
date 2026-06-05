import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  processMessage,
  generateAiSummary,
  createNewConversation,
} from "@/lib/ai/sms-handler";
import { inngest } from "@/lib/inngest/client";
import { z } from "zod";

const schema = z.object({
  orgId: z.string(),
  phone: z.string(),
  message: z.string(),
});

export async function POST(req: Request) {
  const { userId, orgId: clerkOrgId, orgRole } = await auth();
  if (!userId || !clerkOrgId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (orgRole !== "org:admin")
    return NextResponse.json({ error: "Owner only" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const org = await db.organization.findUnique({ where: { id: parsed.data.orgId } });
  if (!org || org.clerkOrgId !== clerkOrgId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const conversation = createNewConversation();
  const { reply, conversation: updated, isComplete } = await processMessage(
    conversation,
    parsed.data.message,
    org.businessName
  );

  if (isComplete) {
    const summary = await generateAiSummary(updated, org.businessName);
    const lead = await db.lead.create({
      data: {
        organizationId: org.id,
        callerPhone: parsed.data.phone,
        channel: "SMS",
        languageDetected: updated.language === "AUTO" ? "EN" : updated.language,
        jobType: updated.collectedData.jobType,
        urgency: updated.collectedData.urgency,
        address: updated.collectedData.address,
        budgetRange: updated.collectedData.budgetRange,
        preferredAppointment: updated.collectedData.preferredAppointment,
        aiSummary: summary,
        testLead: true,
      },
    });
    await db.conversation.create({
      data: {
        leadId: lead.id,
        organizationId: org.id,
        channel: "SMS",
        transcript: updated.transcript,
      },
    });
    await inngest.send({
      name: "lead/created",
      data: { leadId: lead.id, organizationId: org.id },
    });
  }

  return NextResponse.json({ reply });
}
