export function formatDate(
  value?: string,
  timezone = "Europe/Istanbul",
  includeTime = false,
) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: timezone,
  }).format(new Date(value));
}