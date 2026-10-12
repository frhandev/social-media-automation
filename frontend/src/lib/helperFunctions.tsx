export function formatDate(
  value?: string,
  includeTime = false,
  includeYear = false,
) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    day: "numeric",
    month: "short",
    ...(includeYear && { year: "numeric" }),
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }).format(new Date(value));
}

export function dateKey(value: string, timezone = "Europe/Istanbul") {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  }).format(new Date(value));
}

const TIMEZONE = "Europe/Istanbul" as const;

export function scheduleISO(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const instant = new Date(`${date}T${time}:00+03:00`);
  if (Number.isNaN(instant.getTime())) return null;
  // Reject silently normalized, impossible date values.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(instant);
  const value = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  if (`${value.year}-${value.month}-${value.day}` !== date || `${value.hour}:${value.minute}` !== time) return null;
  return instant.toISOString();
}