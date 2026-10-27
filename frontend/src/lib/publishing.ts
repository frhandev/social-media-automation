import type { Platform } from "@/types/platform/Platform";
import type { PostRow } from "@/types/post/PostRow";
import type { PublishingRecord } from "@/types/publishing/PublishingRecord";
import type { PublishingStatus } from "@/types/publishing/PublishingStatus";

export const PUBLISHING_TIME_ZONE = "Europe/Istanbul";

export type PublishingFiltersState = {
  search: string;
  platform: Platform | "all";
  status: PublishingStatus | "all";
  date: string;
};

export type PublishingRow = {
  record: PublishingRecord;
  post: PostRow;
};

export const INITIAL_PUBLISHING_FILTERS: PublishingFiltersState = {
  search: "",
  platform: "all",
  status: "all",
  date: "",
};

export function getPublishingActivityAt(
  record: PublishingRecord,
): string | undefined {
  const activityTimes = [
    record.publishedAt,
    ...record.attempts.map((attempt) => attempt.at),
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value));

  if (activityTimes.length > 0) {
    return new Date(Math.max(...activityTimes)).toISOString();
  }

  return record.scheduledAt;
}

export function getIstanbulDateKey(value?: string): string | null {
  if (!value) return null;

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: PUBLISHING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getPublishingStats(records: PublishingRecord[]) {
  return {
    scheduled: records.filter((record) => record.status === "scheduled").length,

    inProgress: records.filter(
      (record) => record.status === "queued" || record.status === "publishing",
    ).length,

    published: records.filter((record) => record.status === "published").length,

    failed: records.filter((record) => record.status === "failed").length,
  };
}

export function filterPublishingRecords(
  records: PublishingRecord[],
  posts: PostRow[],
  filters: PublishingFiltersState,
): PublishingRow[] {
  const postsById = new Map(posts.map((post) => [post.id, post]));

  const query = filters.search.trim().toLowerCase();

  return records
    .flatMap((record): PublishingRow[] => {
      const post = postsById.get(record.postId);

      return post ? [{ record, post }] : [];
    })
    .filter(({ record, post }) => {
      const matchesSearch = post.title.toLowerCase().includes(query);

      const matchesPlatform =
        filters.platform === "all" || record.platform === filters.platform;

      const matchesStatus =
        filters.status === "all" || record.status === filters.status;

      const activityAt = getPublishingActivityAt(record);

      const matchesDate =
        !filters.date || getIstanbulDateKey(activityAt) === filters.date;

      return matchesSearch && matchesPlatform && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const aTime = Date.parse(getPublishingActivityAt(a.record) ?? "");

      const bTime = Date.parse(getPublishingActivityAt(b.record) ?? "");

      const safeA = Number.isFinite(aTime) ? aTime : 0;
      const safeB = Number.isFinite(bTime) ? bTime : 0;

      return safeB - safeA;
    });
}
