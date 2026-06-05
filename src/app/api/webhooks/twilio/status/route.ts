import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();
  const callSid = formData.get("CallSid")?.toString();
  const callStatus = formData.get("CallStatus")?.toString();

  if (callSid && callStatus) {
    console.log(`Call ${callSid} status: ${callStatus}`);
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
