"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "./language-provider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = [
    { value: "en" as const, label: "English", flag: "🇺🇸" },
    { value: "es" as const, label: "Español", flag: "🇲🇽" },
  ];

  const current = options.find((o) => o.value === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors px-2 py-1 rounded-md hover:bg-[#f1f5f9]"
        aria-label="Select language"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-[#e2e8f0] rounded-lg shadow-lg py-1 z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setLang(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors
                ${lang === opt.value
                  ? "bg-[#f1f5f9] text-[#0f172a] font-medium"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
              {lang === opt.value && (
                <svg className="w-3.5 h-3.5 ml-auto text-[#1b3a6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
