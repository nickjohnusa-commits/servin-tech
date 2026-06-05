import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsFollowUps } from "@/components/app/settings/settings-follow-ups";

export default async function SettingsFollowUpsPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  return (
    <div className="max-w-2xl mx-auto">
      <SettingsFollowUps
        followUpEnabled={org.followUpEnabled}
        followUpDays={org.followUpDays as number[]}
      />
    </div>
  );
}
