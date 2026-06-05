import { cn } from "@/lib/utils";

type Language = "EN" | "ES" | "AUTO";

export function LanguageBadge({
  language,
  className,
}: {
  language: Language;
  className?: string;
}) {
  if (language === "AUTO") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium",
        language === "ES"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-blue-50 text-blue-700 border border-blue-200",
        className
      )}
    >
      {language === "ES" ? "🇲🇽" : "🇺🇸"} {language}
    </span>
  );
}
