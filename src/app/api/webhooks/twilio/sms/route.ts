import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateTwilioSignature } from "@/lib/twilio";
import {
  processMessage,
  generateAiSummary,
  createNewConversation,
  type SmsConversation,
} from "@/lib/ai/sms-handler";
import { inngest } from "@/lib/inngest/client";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const signature = req.headers.get("x-twilio-signature") ?? "";

  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((v, k) => { params[k] = v.toString(); });

  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}${url.pathname}`;
  if (!validateTwilioSignature(signature, fullUrl, params)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const toNumber = params["To"];
  const fromNumber = params["From"];
  const body = params["Body"] ?? "";

  const org = await db.organization.findUnique({
    where: { twilioPhoneNumber: toNumber },
  });

  if (!org || org.subscriptionStatus === "CANCELED") {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  // Load or create SMS conversation state
  const existingConversation = await db.conversation.findFirst({
    where: {
      organizationId: org.id,
      channel: "SMS",
      lead: { callerPhone: fromNumber, status: "NEW" },
    },
    include: { lead: true },
    orderBy: { createdAt: "desc" },
  });

  let conversationState: SmsConversation;
  let leadId: string | null = null;

  if (
    existingConversation?.transcript &&
    Array.isArray(existingConversation.transcript)
  ) {
    conversationState = {
      state: "GREETING",
      language: "AUTO",
      transcript: existingConversation.transcript as SmsConversation["transcript"],
      collectedData: {},
    };
    leadId = existingConversation.leadId;
  } else {
    conversationState = createNewConversation();
  }

  const { reply, conversation: updatedState, isComplete } = await processMessage(
    conversationState,
    body,
    org.businessName
  );

  if (isComplete && !leadId) {
    const summary = await generateAiSummary(updatedState, org.businessName);

    const lead = await db.lead.create({
      data: {
        organizationId: org.id,
        callerPhone: fromNumber,
        channel: "SMS",
        languageDetected: updatedState.language === "AUTO" ? "EN" : updatedState.language,
        jobType: updatedState.collectedData.jobType,
        urgency: updatedState.collectedData.urgency,
        address: updatedState.collectedData.address,
        budgetRange: updatedState.collectedData.budgetRange,
        preferredAppointment: updatedState.collectedData.preferredAppointment,
        aiSummary: summary,
        testLead: org.testMode,
      },
    });

    leadId = lead.id;

    await db.conversation.create({
      data: {
        leadId: lead.id,
        organizationId: org.id,
        channel: "SMS",
        transcript: updatedState.transcript,
      },
    });

    await inngest.send({
      name: "lead/created",
      data: { leadId: lead.id, organizationId: org.id },
    });
  } else if (leadId) {
    await db.conversation.updateMany({
      where: { leadId, channel: "SMS" },
      data: { transcript: updatedState.transcript },
    });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</Message>
</Response>`;

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
