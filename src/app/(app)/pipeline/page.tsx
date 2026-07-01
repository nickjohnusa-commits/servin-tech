import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { PipelineBoard } from "@/components/app/pipeline/pipeline-board";
import type { Lead } from "@/types";

export default async function PipelinePage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  const leads = await db.lead.findMany({
    where: { organizationId: org.id, testLead: false },
    orderBy: { createdAt: "desc" },
  });

  return <PipelineBoard leads={leads as unknown as Lead[]} />;
}
