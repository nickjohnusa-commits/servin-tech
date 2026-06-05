import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TestEnvironment } from "@/components/app/test/test-environment";

export default async function TestPage() {
  const { userId, orgId, orgRole } = await auth();
  if (!orgId) redirect("/sign-in");
  if (orgRole !== "org:admin") redirect("/dashboard");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId! } });
  if (!org) redirect("/sign-in");

  const testLeads = await db.lead.findMany({
    where: { organizationId: org.id, testLead: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <TestEnvironment
      testMode={org.testMode}
      orgId={org.id}
      phoneNumber={org.twilioPhoneNumber}
      testLeads={testLeads as Parameters<typeof TestEnvironment>[0]["testLeads"]}
    />
  );
}
