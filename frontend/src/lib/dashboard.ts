
import type { PostRow } from "@/types/post/PostRow";
import type { PublishingRecord } from "@/types/publishing/PublishingRecord";

export function getDashboardMetrics(posts: PostRow[]) {
  const count = (status: PostRow["status"]) =>
    posts.filter((post) => post.status === status).length;

  return {
    total: posts.length,
    drafts: count("draft"),
    scheduled: count("scheduled"),
    published: count("published"),
    failed: count("failed"),
    queued: count("queued"),
    publishing: count("publishing"),
    partial: count("partial"),
    cancelled: count("cancelled"),
  };
}

export function getUpcomingPosts(
  posts: PostRow[],
  nowMs: number = Date.now(),
  limit = 5,
): PostRow[] {
  return posts
    .filter((post) => {
      if (
        post.status !== "scheduled" &&
        post.status !== "queued"
      ) {
        return false;
      }

      if (!post.scheduledAt) return false;

      const time = Date.parse(post.scheduledAt);

      return Number.isFinite(time) && time > nowMs;
    })
    .sort(
      (a, b) =>
        Date.parse(a.scheduledAt!) -
        Date.parse(b.scheduledAt!),
    )
    .slice(0, limit);
}

export function getRecentPublishingActivity(
  records: PublishingRecord[],
  posts: PostRow[],
  limit = 4,
) {
  const postsById = new Map(
    posts.map((post) => [post.id, post]),
  );

  return records
    .flatMap((record) => {
      if (
        record.status !== "published" &&
        record.status !== "failed"
      ) {
        return [];
      }

      const post = postsById.get(record.postId);
      if (!post) return [];

      const lastAttempt = [...record.attempts].sort(
        (a, b) => Date.parse(b.at) - Date.parse(a.at),
      )[0];

      const occurredAt =
        record.status === "published"
          ? record.publishedAt ?? lastAttempt?.at
          : lastAttempt?.at;

      if (!occurredAt || !Number.isFinite(Date.parse(occurredAt))) {
        return [];
      }

      return [{
        id: record.id,
        post,
        platform: record.platform,
        status: record.status,
        occurredAt,
        error:
          record.status === "failed"
            ? lastAttempt?.error
            : undefined,
      }];
    })
    .sort(
      (a, b) =>
        Date.parse(b.occurredAt) -
        Date.parse(a.occurredAt),
    )
    .slice(0, limit);
}
