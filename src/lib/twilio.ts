import twilio from "twilio";

function getTwilioClient(testMode = false) {
  if (testMode) {
    return twilio(
      process.env.TWILIO_TEST_ACCOUNT_SID!,
      process.env.TWILIO_TEST_AUTH_TOKEN!
    );
  }
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
}

export { getTwilioClient };

export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    signature,
    url,
    params
  );
}

export async function sendSms(
  to: string,
  from: string,
  body: string,
  testMode = false
): Promise<string> {
  const client = getTwilioClient(testMode);
  const message = await client.messages.create({ to, from, body });
  return message.sid;
}

export async function provisionPhoneNumber(
  areaCode: string
): Promise<{ phoneNumber: string; sid: string }> {
  const client = getTwilioClient(false);
  const available = await client.availablePhoneNumbers("US").local.list({
    areaCode: parseInt(areaCode),
    smsEnabled: true,
    voiceEnabled: true,
    limit: 1,
  });

  if (!available.length) {
    const national = await client.availablePhoneNumbers("US").local.list({
      smsEnabled: true,
      voiceEnabled: true,
      limit: 1,
    });
    if (!national.length) throw new Error("No available phone numbers");
    available.push(national[0]);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const purchased = await client.incomingPhoneNumbers.create({
    phoneNumber: available[0].phoneNumber,
    voiceUrl: `${appUrl}/api/webhooks/twilio/voice`,
    voiceMethod: "POST",
    smsUrl: `${appUrl}/api/webhooks/twilio/sms`,
    smsMethod: "POST",
    statusCallback: `${appUrl}/api/webhooks/twilio/status`,
  });

  return { phoneNumber: purchased.phoneNumber, sid: purchased.sid };
}
