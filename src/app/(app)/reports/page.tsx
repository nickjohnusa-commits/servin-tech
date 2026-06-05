import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

type ReportData = {
  totalLeads: number;
  byStatus: Record<string, number>;
  byLanguage: { EN: number; ES: number };
  byChannel: { VOICE: number; SMS: number };
  conversionRate: number;
  won: number;
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default async function ReportsPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) redirect("/sign-in");

  const reports = await db.monthlyReport.findMany({
    where: { organizationId: org.id },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 24,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#64748b]">
          Monthly reports are automatically generated and emailed on the 1st of each month.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center">
          <p className="text-2xl mb-2">📊</p>
          <p className="text-sm font-medium text-[#0f172a]">No reports yet</p>
          <p className="text-xs text-[#64748b] mt-1">
            Your first report will be generated on the 1st of next month.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {(reports as unknown as (typeof reports[0] & { data: ReportData })[]).map((r) => {
            const data = r.data as ReportData;
            return (
              <div key={r.id} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#0f172a]">
                    {MONTH_NAMES[r.month - 1]} {r.year}
                  </h2>
                  {r.emailSentAt && (
                    <span className="text-xs text-[#10b981] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      ✓ Emailed
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Metric label="Total leads" value={data.totalLeads} />
                  <Metric label="Won" value={data.won} color="#10b981" />
                  <Metric label="Conversion" value={`${data.conversionRate}%`} color={data.conversionRate >= 30 ? "#10b981" : "#f59e0b"} />
                  <Metric label="Voice / SMS" value={`${data.byChannel?.VOICE ?? 0} / ${data.byChannel?.SMS ?? 0}`} />
                </div>
                <div className="mt-3 flex gap-3 text-xs text-[#64748b]">
                  <span>🇺🇸 {data.byLanguage?.EN ?? 0} English</span>
                  <span>🇲🇽 {data.byLanguage?.ES ?? 0} Spanish</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div>
      <p className="text-xs text-[#64748b] mb-0.5">{label}</p>
      <p className="text-xl font-bold" style={{ color: color ?? "#0f172a" }}>{value}</p>
    </div>
  );
}
