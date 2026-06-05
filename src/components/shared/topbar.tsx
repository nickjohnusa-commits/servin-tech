"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/pipeline": "Pipeline",
  "/reports": "Reports",
  "/test": "Test Environment",
  "/settings": "Settings — General",
  "/settings/ai": "Settings — AI Config",
  "/settings/notifications": "Settings — Notifications",
  "/settings/follow-ups": "Settings — Follow-ups",
  "/settings/team": "Settings — Team",
  "/settings/billing": "Settings — Billing",
};

type TestModeBannerProps = {
  testMode: boolean;
};

export function Topbar({ testMode }: TestModeBannerProps) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Servin Tech Solutions";

  return (
    <header className="h-14 bg-white border-b border-[#e2e8f0] flex items-center px-6 gap-4 sticky top-0 z-10">
      <h1 className="text-sm font-semibold text-[#0f172a] flex-1">{title}</h1>
      {testMode && (
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Test Mode ON
        </div>
      )}
    </header>
  );
}
