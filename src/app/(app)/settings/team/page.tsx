import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsTeam } from "@/components/app/settings/settings-team";

export default async function SettingsTeamPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  const members = await db.user.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <SettingsTeam members={members as { id: string; name: string; email: string; role: string }[]} />
    </div>
  );
}
