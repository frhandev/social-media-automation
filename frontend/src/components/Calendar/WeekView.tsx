import { cn } from "@/lib/utils";

import { calendarDayKey, formatCalendarDay, getWeekDays } from "@/lib/calendar";

import CalendarEvent from "./CalendarEvent";
import { CalendarPost } from "@/types/calendar/CalendarPost";

type Props = {
  currentDate: Date;
  selectedDate: string | null;
  todayKey: string;
  eventsByDate: Map<string, CalendarPost[]>;
  onSelectDate: (key: string) => void;
};

export default function WeekView({
  currentDate,
  selectedDate,
  todayKey,
  eventsByDate,
  onSelectDate,
}: Props) {
  const days = getWeekDays(currentDate);

  return (
    <section aria-label="Weekly calendar">
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card lg:grid lg:grid-cols-7">
        {days.map((day) => {
          const key = calendarDayKey(day);
          const events = eventsByDate.get(key) ?? [];

          const isToday = key === todayKey;
          const isSelected = key === selectedDate;

          return (
            <div
              key={key}
              className={cn(
                "min-h-80 min-w-0 border-r border-border p-2 last:border-r-0",
                isSelected && "bg-brand/10",
              )}
            >
              <button
                type="button"
                aria-label={`Select ${key}`}
                aria-pressed={isSelected}
                onClick={() => onSelectDate(key)}
                className="mb-4 flex w-full flex-col items-center gap-2 rounded-md px-1 py-3 hover:bg-secondary"
              >
                <span className="text-[11px] font-semibold uppercase text-subtle">
                  {formatCalendarDay(day, {
                    weekday: "short",
                  })}
                </span>

                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full font-display text-xl font-bold",
                    isToday && "bg-brand text-ink",
                    isSelected && "ring-2 ring-ink",
                  )}
                >
                  {day.getUTCDate()}
                </span>

                <span className="text-[10px] text-subtle">
                  {events.length} posts
                </span>
              </button>

              <div className="space-y-2">
                {events.map((post) => (
                  <CalendarEvent key={post.id} post={post} compact />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet and mobile */}
      <div className="space-y-3 lg:hidden">
        {days.map((day) => {
          const key = calendarDayKey(day);
          const events = eventsByDate.get(key) ?? [];

          const isToday = key === todayKey;
          const isSelected = key === selectedDate;

          return (
            <div
              key={key}
              className={cn(
                "rounded-lg border border-border bg-card p-4",
                isSelected && "border-ink bg-brand/10",
              )}
            >
              <button
                type="button"
                aria-label={`Select ${key}`}
                aria-pressed={isSelected}
                onClick={() => onSelectDate(key)}
                className="mb-4 flex w-full items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-md bg-secondary font-display text-xl font-bold",
                      isToday && "bg-brand text-ink",
                    )}
                  >
                    {day.getUTCDate()}
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      {formatCalendarDay(day, {
                        weekday: "long",
                      })}
                    </p>

                    <p className="text-xs text-subtle">
                      {formatCalendarDay(day, {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {events.length} posts
                </span>
              </button>

              {events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((post) => (
                    <CalendarEvent key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-dashed border-border px-4 py-3 text-xs text-subtle">
                  No scheduled posts
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
