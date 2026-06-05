import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Business" },
  { n: 2, label: "Phone" },
  { n: 3, label: "AI Setup" },
  { n: 4, label: "Notify" },
  { n: 5, label: "Subscribe" },
];

export function StepsIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.n} className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                step.n < current
                  ? "bg-[#10b981] text-white"
                  : step.n === current
                    ? "bg-[#1b3a6b] text-white"
                    : "bg-[#e2e8f0] text-[#94a3b8]"
              )}
            >
              {step.n < current ? "✓" : step.n}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium",
                step.n === current ? "text-[#1b3a6b]" : "text-[#94a3b8]"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "w-8 h-px mb-4",
                step.n < current ? "bg-[#10b981]" : "bg-[#e2e8f0]"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
