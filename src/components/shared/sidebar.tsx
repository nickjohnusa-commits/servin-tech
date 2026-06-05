"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const ownerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/leads", label: "Leads", icon: "👤" },
  { href: "/pipeline", label: "Pipeline", icon: "⟶" },
  { href: "/reports", label: "Reports", icon: "📊" },
  { href: "/test", label: "Test", icon: "🧪" },
];

const dispatcherLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/leads", label: "Leads", icon: "👤" },
  { href: "/pipeline", label: "Pipeline", icon: "⟶" },
];

const settingsLinks = [
  { href: "/settings", label: "General", icon: "⚙" },
  { href: "/settings/ai", label: "AI Config", icon: "🤖" },
  { href: "/settings/notifications", label: "Notifications", icon: "🔔" },
  { href: "/settings/follow-ups", label: "Follow-ups", icon: "📨" },
  { href: "/settings/team", label: "Team", icon: "👥" },
  { href: "/settings/billing", label: "Billing", icon: "💳" },
];

type SidebarProps = {
  role: "OWNER" | "DISPATCHER";
  businessName: string;
};

export function Sidebar({ role, businessName }: SidebarProps) {
  const pathname = usePathname();
  const mainLinks = role === "OWNER" ? ownerLinks : dispatcherLinks;

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-[#e2e8f0] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1b3a6b] flex items-center justify-center">
            <span className="text-white text-xs font-bold">ST</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#0f172a] truncate leading-tight">
              {businessName}
            </p>
            <p className="text-[10px] text-[#94a3b8] leading-tight">AI Reception</p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {mainLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === link.href
                ? "bg-[#1b3a6b] text-white font-medium"
                : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
            )}
          >
            <span className="text-base leading-none">{link.icon}</span>
            {link.label}
          </Link>
        ))}

        {role === "OWNER" && (
          <>
            <div className="pt-4 pb-1">
              <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider px-3">
                Settings
              </p>
            </div>
            {settingsLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                  pathname.startsWith(link.href) && pathname === link.href
                    ? "bg-[#f1f5f9] text-[#0f172a] font-medium"
                    : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                )}
              >
                <span className="text-base leading-none">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Bottom: user */}
      <div className="p-4 border-t border-[#e2e8f0] flex items-center gap-3">
        <UserButton />
        <span className="text-xs text-[#64748b] capitalize">{role.toLowerCase()}</span>
      </div>
    </aside>
  );
}
