import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsAi } from "@/components/app/settings/settings-ai";

export default async function SettingsAiPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  return (
    <div className="max-w-2xl mx-auto">
      <SettingsAi
        defaultLanguage={org.defaultLanguage as "EN" | "ES" | "AUTO"}
        aiGreetingEn={org.aiGreetingEn}
        aiGreetingEs={org.aiGreetingEs}
      />
    </div>
  );
}
