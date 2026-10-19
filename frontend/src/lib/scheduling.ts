import { ScheduleErrors } from "@/types/ScheduleErrors";
import { ScheduleValidation } from "@/types/ScheduleValidation";

export const PUBLISHING_TIME_ZONE = "Europe/Istanbul";

function getTimezoneOffsetMinutes(instantMs: number): number | null {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: PUBLISHING_TIME_ZONE,
    timeZoneName: "shortOffset",
  });

  const zoneName = formatter
    .formatToParts(new Date(instantMs))
    .find((part) => part.type === "timeZoneName")?.value;

  if (zoneName === "GMT") return 0;

  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(zoneName ?? "");

  if (!match) return null;

  const sign = match[1] === "+" ? 1 : -1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");

  return sign * (hours * 60 + minutes);
}

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1000 || month < 1 || month > 12) {
    return null;
  }

  const utc = new Date(Date.UTC(year, month - 1, day));

  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function parseTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour > 23 || minute > 59) return null;

  return { hour, minute };
}

export function toIstanbulInstant(date: string, time: string): Date | null {
  const parsedDate = parseDate(date);
  const parsedTime = parseTime(time);

  if (!parsedDate || !parsedTime) return null;

  const { year, month, day } = parsedDate;
  const { hour, minute } = parsedTime;

  // Treat the entered wall-clock values as UTC
  // temporarily, then subtract Istanbul's offset.
  const wallClockMs = Date.UTC(year, month - 1, day, hour, minute);

  let instantMs = wallClockMs;

  // Resolve the offset at the target instant,
  // rather than relying on the user's computer.
  for (let i = 0; i < 3; i++) {
    const offset = getTimezoneOffsetMinutes(instantMs);

    if (offset === null) return null;

    instantMs = wallClockMs - offset * 60_000;
  }

  const instant = new Date(instantMs);

  // Verify the converted instant represents
  // exactly the requested Istanbul wall time.
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: PUBLISHING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(instant).map((part) => [part.type, part.value]),
  );

  const matches =
    Number(parts.year) === year &&
    Number(parts.month) === month &&
    Number(parts.day) === day &&
    Number(parts.hour) === hour &&
    Number(parts.minute) === minute;

  return matches ? instant : null;
}

export function validateSchedule(
  date: string,
  time: string,
  nowMs = Date.now(),
): ScheduleValidation {
  const errors: ScheduleErrors = {};

  if (!date.trim()) {
    errors.date = "Select a publication date.";
  } else if (!parseDate(date)) {
    errors.date = "Enter a valid calendar date.";
  }

  if (!time.trim()) {
    errors.time = "Select a publication time.";
  } else if (!parseTime(time)) {
    errors.time = "Enter a valid time.";
  }

  if (errors.date || errors.time) {
    return {
      valid: false,
      errors,
      scheduledAt: null,
    };
  }

  const instant = toIstanbulInstant(date, time);

  if (!instant) {
    return {
      valid: false,
      errors: {
        time: "Invalid date or time in Europe/Istanbul.",
      },
      scheduledAt: null,
    };
  }

  if (instant.getTime() <= nowMs) {
    return {
      valid: false,
      errors: {
        time: "Choose a future publication time.",
      },
      scheduledAt: null,
    };
  }

  return {
    valid: true,
    errors: {},
    scheduledAt: instant.toISOString(),
  };
}
