import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import type { UserRole } from "@/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect("/sign-in");

  // Read pathname injected by middleware to avoid infinite redirect on /onboarding
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isOnboarding = pathname.startsWith("/onboarding");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-up");

  if (!org.onboardingComplete && !isOnboarding) redirect("/onboarding");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  const role: UserRole = (user?.role as UserRole) ?? "DISPATCHER";

  // Onboarding uses its own minimal layout (no sidebar/topbar)
  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar role={role} businessName={org.businessName} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar testMode={org.testMode} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
