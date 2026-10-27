import type { PostLifecycle } from "@/types/post/PostLifecycle";

export type PublishingStatus = Extract<
  PostLifecycle,
  "scheduled" | "queued" | "publishing" | "published" | "failed" | "cancelled"
>;
