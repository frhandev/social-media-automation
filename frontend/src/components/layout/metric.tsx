import { cn } from "@/lib/utils";

export function Metric({
  label,
  value,
  hint,
  emphasis = false,
  tone = "default",
  className,
}: {
  label: string;
  value: number | string;
  hint?: string;
  emphasis?: boolean;
  tone?: "default" | "success" | "warning" | "destructive" | "info";
  className?: string;
}) {
  const toneText = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    info: "text-brand-2",
  }[tone];

  if (emphasis) {
    return (
      <div
        className={cn(
          "flex flex-col justify-between gap-6 rounded-lg border-2 border-ink bg-brand p-6 shadow-brutal-sm",
          className,
        )}
      >
        <span className="eyebrow text-ink/70">{label}</span>
        <div>
          <div className="numeric text-6xl text-ink">{value}</div>
          {hint ? <p className="mt-2 text-xs font-medium text-ink/70">{hint}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 border-t border-border bg-card px-4 py-4 sm:rounded-none",
        className,
      )}
    >
      <span className="eyebrow">{label}</span>
      <div>
        <div className={cn("numeric text-3xl", toneText)}>{value}</div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}
