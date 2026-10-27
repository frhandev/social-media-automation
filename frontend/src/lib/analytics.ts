import {
  addCalendarDays,
  calendarDayKey,
  istanbulDateKey,
  parseDayKey,
} from "@/lib/calendar";

import type { Platform } from "@/types/platform/Platform";
import type { PostRow } from "@/types/post/PostRow";
import type { PublishingRecord } from "@/types/publishing/PublishingRecord";
import type { AnalyticsDailyRecord } from "@/types/analytics/AnalyticsDailyRecord";
import type {
  AnalyticsDateRange,
  AnalyticsFiltersState,
} from "@/types/analytics/AnalyticsFiltersState";

export type AnalyticsFact = {
  record: AnalyticsDailyRecord;
  publication: PublishingRecord;
  post: PostRow;
};

export type AnalyticsOverviewData = {
  views: number;
  likes: number;
  comments: number;
  availableShares: number;
  missingSharesRecords: number;
  engagements: number;
  engagementRate: number | null;
};

export type ViewsPoint = {
  date: string;
  views: number;
};

export type EngagementPoint = {
  date: string;
  likes: number;
  comments: number;
  shares: number | null;
};

export type PlatformComparisonPoint = {
  platform: Platform;
  label: string;
  views: number | null;
};

export type TopPerformingPost = {
  post: PostRow;
  platforms: Platform[];
  views: number;
  engagements: number;
  engagementRate: number | null;
  hasMissingShares: boolean;
};

const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
};

export const ANALYTICS_PLATFORMS: Platform[] = [
  "youtube",
  "tiktok",
  "instagram",
];

export function calculateEngagementRate(
  views: number,
  likes: number,
  comments: number,
  availableShares: number,
): number | null {
  if (views <= 0) return null;

  return ((likes + comments + availableShares) / views) * 100;
}

export function getAnalyticsDayKeys(
  todayKey: string,
  days: AnalyticsDateRange,
): string[] {
  const today = parseDayKey(todayKey);

  return Array.from({ length: days }, (_, index) => {
    const daysBack = days - 1 - index;

    return calendarDayKey(addCalendarDays(today, -daysBack));
  });
}

export function filterAnalyticsRecords(
  records: AnalyticsDailyRecord[],
  publications: PublishingRecord[],
  posts: PostRow[],
  filters: AnalyticsFiltersState,
  todayKey: string,
): AnalyticsFact[] {
  const publicationsById = new Map(
    publications.map((publication) => [publication.id, publication]),
  );

  const postsById = new Map(posts.map((post) => [post.id, post]));

  const dayKeys = getAnalyticsDayKeys(todayKey, filters.days);

  const startKey = dayKeys[0];

  return records.flatMap((record): AnalyticsFact[] => {
    const publication = publicationsById.get(record.publicationId);

    if (
      !publication ||
      publication.status !== "published" ||
      !publication.publishedAt
    ) {
      return [];
    }

    const post = postsById.get(publication.postId);

    if (!post || !post.platforms.includes(publication.platform)) {
      return [];
    }

    // Reject analytics before a successful publication.
    const publishedAtMs = Date.parse(publication.publishedAt);

    if (!Number.isFinite(publishedAtMs)) {
      return [];
    }

    const publishedDay = istanbulDateKey(publication.publishedAt);

    if (record.date < publishedDay) return [];

    if (record.date < startKey || record.date > todayKey) {
      return [];
    }

    if (
      filters.platform !== "all" &&
      filters.platform !== publication.platform
    ) {
      return [];
    }

    return [{ record, publication, post }];
  });
}

export function aggregateAnalyticsOverview(
  facts: AnalyticsFact[],
): AnalyticsOverviewData {
  let views = 0;
  let likes = 0;
  let comments = 0;
  let availableShares = 0;
  let missingSharesRecords = 0;

  for (const { record } of facts) {
    views += record.views;
    likes += record.likes;
    comments += record.comments;

    if (record.shares === null) {
      missingSharesRecords++;
    } else {
      availableShares += record.shares;
    }
  }

  return {
    views,
    likes,
    comments,
    availableShares,
    missingSharesRecords,
    engagements: likes + comments + availableShares,
    engagementRate: calculateEngagementRate(
      views,
      likes,
      comments,
      availableShares,
    ),
  };
}

export function buildViewsSeries(
  facts: AnalyticsFact[],
  todayKey: string,
  days: AnalyticsDateRange,
): ViewsPoint[] {
  const totals = new Map<string, number>();

  for (const { record } of facts) {
    totals.set(record.date, (totals.get(record.date) ?? 0) + record.views);
  }

  return getAnalyticsDayKeys(todayKey, days).map((date) => ({
    date,
    views: totals.get(date) ?? 0,
  }));
}

export function buildEngagementSeries(
  facts: AnalyticsFact[],
  todayKey: string,
  days: AnalyticsDateRange,
): EngagementPoint[] {
  const totals = new Map<string, EngagementPoint>();

  for (const { record } of facts) {
    const current = totals.get(record.date) ?? {
      date: record.date,
      likes: 0,
      comments: 0,
      shares: null,
    };

    current.likes += record.likes;
    current.comments += record.comments;

    if (record.shares !== null) {
      current.shares = (current.shares ?? 0) + record.shares;
    }

    totals.set(record.date, current);
  }

  return getAnalyticsDayKeys(todayKey, days).map(
    (date) =>
      totals.get(date) ?? {
        date,
        likes: 0,
        comments: 0,
        shares: null,
      },
  );
}

export function buildPlatformComparison(
  facts: AnalyticsFact[],
  platformFilter: Platform | "all",
): PlatformComparisonPoint[] {
  const totals = new Map<Platform, number>();

  for (const { record, publication } of facts) {
    const platform = publication.platform;

    totals.set(platform, (totals.get(platform) ?? 0) + record.views);
  }

  const platforms =
    platformFilter === "all" ? ANALYTICS_PLATFORMS : [platformFilter];

  return platforms.map((platform) => ({
    platform,
    label: PLATFORM_LABELS[platform],
    views: totals.has(platform) ? totals.get(platform)! : null,
  }));
}

export function getTopPerformingPosts(
  facts: AnalyticsFact[],
  limit = 5,
): TopPerformingPost[] {
  type Accumulator = {
    post: PostRow;
    platforms: Platform[];
    views: number;
    likes: number;
    comments: number;
    availableShares: number;
    hasMissingShares: boolean;
  };

  const grouped = new Map<string, Accumulator>();

  for (const { record, publication, post } of facts) {
    let current = grouped.get(post.id);

    if (!current) {
      current = {
        post,
        platforms: [],
        views: 0,
        likes: 0,
        comments: 0,
        availableShares: 0,
        hasMissingShares: false,
      };

      grouped.set(post.id, current);
    }

    if (!current.platforms.includes(publication.platform)) {
      current.platforms.push(publication.platform);
    }

    current.views += record.views;
    current.likes += record.likes;
    current.comments += record.comments;

    if (record.shares === null) {
      current.hasMissingShares = true;
    } else {
      current.availableShares += record.shares;
    }
  }

  return [...grouped.values()]
    .map(
      (item): TopPerformingPost => ({
        post: item.post,
        platforms: item.platforms,
        views: item.views,
        engagements: item.likes + item.comments + item.availableShares,
        engagementRate: calculateEngagementRate(
          item.views,
          item.likes,
          item.comments,
          item.availableShares,
        ),
        hasMissingShares: item.hasMissingShares,
      }),
    )
    .sort(
      (a, b) => b.views - a.views || a.post.title.localeCompare(b.post.title),
    )
    .slice(0, limit);
}
