import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatRelative, urgencyColor } from "@/lib/utils";
import { LanguageBadge } from "@/components/shared/language-badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import Link from "next/link";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; lang?: string; q?: string }>;
}) {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  const params = await searchParams;
  const statusFilter = params.status as string | undefined;
  const langFilter = params.lang as string | undefined;
  const query = params.q;

  const leads = await db.lead.findMany({
    where: {
      organizationId: org.id,
      testLead: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(statusFilter && { status: statusFilter as any }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(langFilter && { languageDetected: langFilter as any }),
      ...(query && {
        OR: [
          { callerPhone: { contains: query, mode: "insensitive" } },
          { callerName: { contains: query, mode: "insensitive" } },
          { jobType: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const statuses = [
    "NEW", "CONTACTED", "ESTIMATE_SCHEDULED", "ESTIMATE_SENT", "WON", "LOST",
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <form className="flex-1 min-w-48">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by phone, name, job type…"
            className="w-full border border-[#e2e8f0] rounded-md px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
        </form>
        <div className="flex flex-wrap gap-1.5">
          <Link
            href="/leads"
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!statusFilter ? "bg-[#1b3a6b] text-white border-[#1b3a6b]" : "border-[#e2e8f0] text-[#64748b] hover:border-[#1b3a6b]"}`}
          >
            All
          </Link>
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/leads?status=${s}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${statusFilter === s ? "bg-[#1b3a6b] text-white border-[#1b3a6b]" : "border-[#e2e8f0] text-[#64748b] hover:border-[#1b3a6b]"}`}
            >
              {STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
            </Link>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(["EN", "ES"] as const).map((l) => (
            <Link
              key={l}
              href={`/leads?lang=${l}${statusFilter ? `&status=${statusFilter}` : ""}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${langFilter === l ? "bg-[#1b3a6b] text-white border-[#1b3a6b]" : "border-[#e2e8f0] text-[#64748b] hover:border-[#1b3a6b]"}`}
            >
              {l === "EN" ? "🇺🇸 EN" : "🇲🇽 ES"}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-sm font-medium text-[#0f172a]">No leads found</p>
            <p className="text-xs text-[#64748b] mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9]">
            <div className="grid grid-cols-12 gap-3 px-5 py-2.5 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide bg-[#f8fafc]">
              <div className="col-span-3">Caller</div>
              <div className="col-span-2">Job type</div>
              <div className="col-span-2">Address</div>
              <div className="col-span-1 text-center">Urgency</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Received</div>
            </div>
            {(leads as import("@/types").Lead[]).map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="grid grid-cols-12 gap-3 px-5 py-3.5 hover:bg-[#f8fafc] transition-colors items-center"
              >
                <div className="col-span-3 flex items-center gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0f172a] truncate">
                      {lead.callerName ?? lead.callerPhone}
                    </p>
                    {lead.callerName && (
                      <p className="text-xs text-[#94a3b8] truncate">{lead.callerPhone}</p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <LanguageBadge language={lead.languageDetected as "EN" | "ES" | "AUTO"} />
                    <span className="text-xs">{lead.channel === "VOICE" ? "📞" : "💬"}</span>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-[#64748b] truncate">
                  {lead.jobType ?? "—"}
                </div>
                <div className="col-span-2 text-sm text-[#64748b] truncate">
                  {lead.address ?? "—"}
                </div>
                <div className="col-span-1 text-center">
                  {lead.urgency ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor(lead.urgency)}`}>
                      {lead.urgency}
                    </span>
                  ) : (
                    <span className="text-[#94a3b8] text-sm">—</span>
                  )}
                </div>
                <div className="col-span-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS],
                      background: `${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]}18`,
                    }}
                  >
                    {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS]}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-[#94a3b8] text-right">
                  {formatRelative(lead.createdAt)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
