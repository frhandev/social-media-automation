import { CalendarPost } from "@/types/calendar/CalendarPost";
import { CalendarView } from "@/types/calendar/CalendarView";
import type { PostRow } from "@/types/post/PostRow";

export const CALENDAR_TIME_ZONE = "Europe/Istanbul";

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: CALENDAR_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: CALENDAR_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function partsToDateKey(parts: Intl.DateTimeFormatPart[]): string {
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function istanbulDateKey(instant: string | Date): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;

  return partsToDateKey(dayFormatter.formatToParts(date));
}

export function getIstanbulTodayKey(now: Date = new Date()): string {
  return istanbulDateKey(now);
}

export function formatEventTime(scheduledAt: string): string {
  return timeFormatter.format(new Date(scheduledAt));
}

// Calendar dates always use UTC noon internally.
// This prevents device-local timezone differences.
export function parseDayKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function calendarDayKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addCalendarDays(date: Date, amount: number): Date {
  const result = new Date(date.getTime());

  result.setUTCDate(result.getUTCDate() + amount);

  return result;
}

export function addCalendarMonths(date: Date, amount: number): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1, 12),
  );
}

export function startOfCalendarWeek(date: Date): Date {
  const weekday = date.getUTCDay();

  // Monday = 0, Sunday = 6
  const offset = (weekday + 6) % 7;

  return addCalendarDays(date, -offset);
}

export function getWeekDays(date: Date): Date[] {
  const monday = startOfCalendarWeek(date);

  return Array.from({ length: 7 }, (_, index) =>
    addCalendarDays(monday, index),
  );
}

export function getMonthDays(date: Date): Date[] {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  const firstDay = new Date(Date.UTC(year, month, 1, 12));

  const leadingDays = (firstDay.getUTCDay() + 6) % 7;

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0, 12)).getUTCDate();

  const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

  const start = addCalendarDays(firstDay, -leadingDays);

  return Array.from({ length: totalCells }, (_, index) =>
    addCalendarDays(start, index),
  );
}

export function isSameCalendarMonth(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth()
  );
}

export function formatCalendarDay(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  },
): string {
  return new Intl.DateTimeFormat("en-GB", {
    ...options,
    timeZone: "UTC",
  }).format(date);
}

export function getCalendarPeriodTitle(date: Date, view: CalendarView): string {
  if (view === "month") {
    return formatCalendarDay(date, {
      month: "long",
      year: "numeric",
    });
  }

  const days = getWeekDays(date);

  const start = formatCalendarDay(days[0], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const end = formatCalendarDay(days[6], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${start} – ${end}`;
}

export function getCalendarPosts(items: PostRow[]): CalendarPost[] {
  return items
    .filter(
      (post): post is CalendarPost =>
        typeof post.scheduledAt === "string" &&
        post.scheduledAt.trim().length > 0 &&
        Number.isFinite(Date.parse(post.scheduledAt)),
    )
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt));
}

export function groupCalendarPosts(
  items: CalendarPost[],
): Map<string, CalendarPost[]> {
  const grouped = new Map<string, CalendarPost[]>();

  for (const post of items) {
    const key = istanbulDateKey(post.scheduledAt);

    const existing = grouped.get(key) ?? [];
    existing.push(post);
    grouped.set(key, existing);
  }

  // getCalendarPosts already sorted chronologically.
  return grouped;
}
