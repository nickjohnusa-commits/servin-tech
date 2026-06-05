import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateTwilioSignature } from "@/lib/twilio";

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
  const org = await db.organization.findUnique({
    where: { twilioPhoneNumber: toNumber },
  });

  if (!org || org.subscriptionStatus === "CANCELED") {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>This number is not currently active. Please try again later.</Say>
  <Hangup/>
</Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  const voiceServerUrl = process.env.VOICE_SERVER_URL;
  const streamUrl = `${voiceServerUrl}/stream?orgId=${org.id}`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${streamUrl}">
      <Parameter name="orgId" value="${org.id}" />
      <Parameter name="businessName" value="${encodeURIComponent(org.businessName)}" />
      <Parameter name="language" value="${org.defaultLanguage}" />
      <Parameter name="testMode" value="${org.testMode}" />
    </Stream>
  </Connect>
</Response>`;

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
