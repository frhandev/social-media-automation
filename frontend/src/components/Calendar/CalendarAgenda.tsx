import Link from "next/link";
import { CalendarClock, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatCalendarDay, parseDayKey } from "@/lib/calendar";

import CalendarEvent from "./CalendarEvent";
import { CalendarPost } from "@/types/calendar/CalendarPost";

type Props = {
  selectedDate: string | null;
  events: CalendarPost[];
};

export default function CalendarAgenda({ selectedDate, events }: Props) {
  const title = selectedDate
    ? formatCalendarDay(parseDayKey(selectedDate))
    : "Choose a day";

  return (
    <aside className="min-w-0">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
          <div className="min-w-0">
            <p className="eyebrow mb-2">SELECTED DAY</p>

            <h2 className="font-display text-xl font-bold sm:text-2xl">
              {title}
            </h2>

            <p className="mt-2 text-xs text-muted-foreground">
              {events.length} post
              {events.length === 1 ? "" : "s"} with recorded schedules
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/posts/new">
              <Plus size={14} />
              Create post
            </Link>
          </Button>
        </div>

        {selectedDate && events.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {events.map((post) => (
              <CalendarEvent key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-lg border border-dashed border-border bg-secondary/30 p-5 sm:p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-card">
              <CalendarClock size={21} className="text-subtle" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {selectedDate
                  ? "No scheduled posts for this day."
                  : "Select a date"}
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {selectedDate
                  ? "Choose another day to explore your content."
                  : "Click a day on the calendar to see its posts."}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-[11px] text-subtle">Read-only calendar</p>

          <p className="text-[11px] text-subtle">Europe/Istanbul</p>
        </div>
      </section>
    </aside>
  );
}
