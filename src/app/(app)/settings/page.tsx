import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsGeneral } from "@/components/app/settings/settings-general";

export default async function SettingsPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  return (
    <div className="max-w-2xl mx-auto">
      <SettingsGeneral
        businessName={org.businessName}
        timezone={org.timezone}
        twilioPhoneNumber={org.twilioPhoneNumber}
      />
    </div>
  );
}
