"use client";

import Link from "next/link";
import { useLang } from "./language-provider";
import { t } from "@/lib/i18n";

export function NavLinks() {
  const { lang } = useLang();
  const tx = t[lang].nav;
  return (
    <>
      <Link href="/pricing" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
        {tx.pricing}
      </Link>
      <Link href="/docs/setup" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
        {tx.docs}
      </Link>
      <Link href="/sign-in" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
        {tx.signIn}
      </Link>
      <Link
        href="/sign-up"
        className="bg-[#1b3a6b] text-white text-sm px-4 py-2 rounded-md hover:bg-[#162e55] transition-colors"
      >
        {tx.getStarted}
      </Link>
    </>
  );
}
