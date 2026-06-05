import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { provisionPhoneNumber } from "@/lib/twilio";

export async function POST() {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (orgRole !== "org:admin")
    return NextResponse.json({ error: "Owner only" }, { status: 403 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

  if (org.twilioPhoneNumber) {
    return NextResponse.json({ phoneNumber: org.twilioPhoneNumber });
  }

  try {
    const { phoneNumber, sid } = await provisionPhoneNumber(
      org.businessName.replace(/\D/g, "").slice(0, 3) || "800"
    );

    await db.organization.update({
      where: { id: org.id },
      data: { twilioPhoneNumber: phoneNumber, twilioPhoneSid: sid },
    });

    return NextResponse.json({ phoneNumber });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Provisioning failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
