import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsNotifications } from "@/components/app/settings/settings-notifications";

export default async function SettingsNotificationsPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  return (
    <div className="max-w-2xl mx-auto">
      <SettingsNotifications
        notificationEmails={org.notificationEmails}
        notificationPhones={org.notificationPhones}
      />
    </div>
  );
}
