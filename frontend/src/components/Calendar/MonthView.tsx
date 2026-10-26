import { cn } from "@/lib/utils";

import {
  calendarDayKey,
  getMonthDays,
  isSameCalendarMonth,
} from "@/lib/calendar";

import CalendarEvent from "./CalendarEvent";
import { CalendarPost } from "@/types/calendar/CalendarPost";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

type Props = {
  currentDate: Date;
  selectedDate: string | null;
  todayKey: string;
  eventsByDate: Map<string, CalendarPost[]>;
  onSelectDate: (key: string) => void;
};

export default function MonthView({
  currentDate,
  selectedDate,
  todayKey,
  eventsByDate,
  onSelectDate,
}: Props) {
  const days = getMonthDays(currentDate);

  return (
    <section
      aria-label="Monthly calendar"
      className="min-w-0 overflow-hidden rounded-xl border border-border bg-card"
    >
      {/* Weekday headings */}
      <div className="grid grid-cols-7 border-b border-border bg-secondary">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[10px] font-bold tracking-widest text-muted-foreground sm:text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden grid-cols-7 md:grid">
        {days.map((day, index) => {
          const key = calendarDayKey(day);
          const events = eventsByDate.get(key) ?? [];

          const isCurrentMonth = isSameCalendarMonth(day, currentDate);
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;

          const visibleEvents = events.slice(0, 2);
          const remaining = events.length - 2;

          const isLastColumn = index % 7 === 6;
          const isLastRow = index >= days.length - 7;

          return (
            <div
              key={key}
              className={cn(
                "relative min-w-0 min-h-28 p-2 transition-colors lg:min-h-32 lg:p-2.5",
                !isLastColumn && "border-r border-border",
                !isLastRow && "border-b border-border",
                !isCurrentMonth && "bg-secondary/35",
                isSelected && "bg-brand/10",
              )}
            >
              {/* Day header */}
              <div className="mb-2 flex items-center justify-between gap-1">
                <button
                  type="button"
                  aria-label={`Select ${key}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelectDate(key)}
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md font-display text-xs font-bold transition-colors hover:bg-secondary",
                    isToday && "bg-brand text-ink",
                    isSelected && "ring-2 ring-ink",
                    !isCurrentMonth && "text-subtle",
                  )}
                >
                  {day.getUTCDate()}
                </button>

                {events.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectDate(key)}
                    aria-label={`${events.length} posts on ${key}`}
                    className="rounded-md px-1.5 py-1 text-[10px] font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    {events.length}
                    <span className="hidden xl:inline"> posts</span>
                  </button>
                )}
              </div>

              {/* Scheduled posts */}
              <div className="space-y-1">
                {visibleEvents.map((post) => (
                  <CalendarEvent key={post.id} post={post} compact />
                ))}

                {remaining > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectDate(key)}
                    className="w-full rounded px-2 py-1.5 text-left text-[10px] font-bold text-brand-2 transition-colors hover:bg-secondary"
                  >
                    +{remaining} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-7 md:hidden">
        {days.map((day, index) => {
          const key = calendarDayKey(day);
          const events = eventsByDate.get(key) ?? [];

          const isToday = key === todayKey;
          const isSelected = key === selectedDate;
          const isCurrentMonth = isSameCalendarMonth(day, currentDate);

          const isLastColumn = index % 7 === 6;
          const isLastRow = index >= days.length - 7;

          return (
            <button
              key={key}
              type="button"
              aria-label={`Select ${key}, ${events.length} posts`}
              aria-pressed={isSelected}
              onClick={() => onSelectDate(key)}
              className={cn(
                "flex min-h-16 min-w-0 flex-col items-center justify-start gap-1.5 p-1.5 transition-colors",
                !isLastColumn && "border-r border-border",
                !isLastRow && "border-b border-border",
                !isCurrentMonth && "bg-secondary/35",
                isSelected && "bg-brand/15",
              )}
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full font-display text-xs font-semibold",
                  isToday && "bg-brand text-ink",
                  isSelected && "ring-2 ring-ink",
                  !isCurrentMonth && "text-subtle",
                )}
              >
                {day.getUTCDate()}
              </span>

              {events.length > 0 && (
                <span className="rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-semibold leading-none text-ink-foreground">
                  {events.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
