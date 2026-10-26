import { CalendarDays, ChevronLeft, ChevronRight, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarView } from "@/types/calendar/CalendarView";

type Props = {
  title: string;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function CalendarToolbar({
  title,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: Props) {
  return (
    <div className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 space-y-2">
        <p className="eyebrow">PUBLISHING TIMELINE</p>

        <h2
          className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
          aria-live="polite"
        >
          {title}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Previous ${view}`}
            onClick={onPrevious}
          >
            <ChevronLeft size={17} />
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Next ${view}`}
            onClick={onNext}
          >
            <ChevronRight size={17} />
          </Button>
        </div>

        <div
          role="group"
          aria-label="Calendar view"
          className="ml-auto flex rounded-md border border-border bg-card p-1 sm:ml-2"
        >
          <button
            type="button"
            aria-pressed={view === "month"}
            onClick={() => onViewChange("month")}
            className={cn(
              "flex items-center gap-2 rounded px-3 py-2 text-xs font-semibold transition-colors",
              view === "month"
                ? "bg-ink text-ink-foreground"
                : "text-muted-foreground hover:bg-secondary",
            )}
          >
            <CalendarDays size={14} />
            Month
          </button>

          <button
            type="button"
            aria-pressed={view === "week"}
            onClick={() => onViewChange("week")}
            className={cn(
              "flex items-center gap-2 rounded px-3 py-2 text-xs font-semibold transition-colors",
              view === "week"
                ? "bg-ink text-ink-foreground"
                : "text-muted-foreground hover:bg-secondary",
            )}
          >
            <List size={14} />
            Week
          </button>
        </div>
      </div>
    </div>
  );
}
