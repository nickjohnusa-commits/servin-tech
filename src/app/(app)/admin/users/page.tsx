import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.PLATFORM_ADMIN_EMAIL ?? "";

const TIER_COLORS: Record<string, string> = {
  STARTER: "bg-[#f1f5f9] text-[#475569]",
  PROFESSIONAL: "bg-[#eff6ff] text-[#1d4ed8]",
  AGENCY: "bg-[#f0fdf4] text-[#15803d]",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-[#f0fdf4] text-[#15803d]",
  TRIALING: "bg-[#fff7ed] text-[#c2410c]",
  PAST_DUE: "bg-[#fff1f2] text-[#be123c]",
  CANCELED: "bg-[#f1f5f9] text-[#94a3b8]",
  PAUSED: "bg-[#fefce8] text-[#a16207]",
};

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminUsersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  if (email !== ADMIN_EMAIL) notFound();

  const orgs = await db.organization.findMany({
    include: {
      users: { orderBy: { createdAt: "asc" } },
      _count: { select: { leads: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = orgs.reduce((acc, o) => acc + o.users.length, 0);
  const activeOrgs = orgs.filter((o) => o.subscriptionStatus === "ACTIVE").length;
  const trialingOrgs = orgs.filter((o) => o.subscriptionStatus === "TRIALING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Admin — All Accounts</h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Platform-level view · {orgs.length} organizations · {totalUsers} users
          </p>
        </div>
        <span className="text-xs bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-2.5 py-1 rounded-full font-medium">
          Restricted
        </span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Organizations", value: orgs.length, sub: "total accounts" },
          { label: "Active", value: activeOrgs, sub: "paying subscribers" },
          { label: "Trialing", value: trialingOrgs, sub: "in free trial" },
          { label: "Users", value: totalUsers, sub: "team members" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <p className="text-xs text-[#64748b] font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-[#0f172a]">{s.value}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Accounts table */}
      {orgs.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-16 text-center">
          <p className="text-3xl mb-3">🏢</p>
          <p className="text-sm font-medium text-[#0f172a]">No accounts yet</p>
          <p className="text-xs text-[#64748b] mt-1">
            Organizations will appear here after users sign up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden"
            >
              {/* Org header row */}
              <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#f1f5f9] bg-[#f8fafc]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#0f172a] truncate">
                      {org.businessName}
                    </p>
                    {!org.onboardingComplete && (
                      <span className="text-[10px] bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa] px-1.5 py-0.5 rounded font-medium">
                        Setup incomplete
                      </span>
                    )}
                    {org.testMode && (
                      <span className="text-[10px] bg-[#fefce8] text-[#a16207] border border-[#fde68a] px-1.5 py-0.5 rounded font-medium">
                        Test mode
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {org.slug} · joined {fmt(org.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      TIER_COLORS[org.subscriptionTier] ?? "bg-[#f1f5f9] text-[#475569]"
                    }`}
                  >
                    {org.subscriptionTier}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      STATUS_COLORS[org.subscriptionStatus] ?? "bg-[#f1f5f9] text-[#475569]"
                    }`}
                  >
                    {org.subscriptionStatus}
                  </span>
                  <span className="text-xs text-[#94a3b8] font-mono">
                    {org.twilioPhoneNumber ?? "No phone"}
                  </span>
                  <span className="text-xs text-[#94a3b8]">
                    {org._count.leads} lead{org._count.leads !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Users table */}
              {org.users.length === 0 ? (
                <p className="px-5 py-3 text-xs text-[#94a3b8] italic">No users in this org</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide">
                        Name
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide">
                        Email
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide">
                        Role
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide">
                        Phone
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f8fafc]">
                    {org.users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 font-medium text-[#0f172a] text-xs">
                          {user.name}
                        </td>
                        <td className="px-5 py-3 text-[#64748b] text-xs">{user.email}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              user.role === "OWNER"
                                ? "bg-[#eff6ff] text-[#1d4ed8]"
                                : "bg-[#f1f5f9] text-[#475569]"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#64748b] text-xs font-mono">
                          {user.phone ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-[#94a3b8] text-xs">{fmt(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
