"use client";

import { useLang } from "./language-provider";
import { t } from "@/lib/i18n";

export function FooterLinks() {
  const { lang } = useLang();
  return (
    <p className="text-xs text-[#94a3b8]">
      © {new Date().getFullYear()} Servin Tech Solutions. {t[lang].footer.rights}
    </p>
  );
}
