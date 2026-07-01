import { validateTwilioSignature } from "@/lib/twilio";

const XML_OK = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
const XML_HEADERS = { "Content-Type": "text/xml" };

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const signature = req.headers.get("x-twilio-signature") ?? "";

    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((v, k) => { params[k] = v.toString(); });

    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}${url.pathname}`;
    if (!validateTwilioSignature(signature, fullUrl, params)) {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response(XML_OK, { headers: XML_HEADERS });
  } catch (err) {
    console.error("[twilio/status] error:", err);
    return new Response(XML_OK, { headers: XML_HEADERS });
  }
}
