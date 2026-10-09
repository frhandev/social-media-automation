export type PostLifecycle =
  | "draft"
  | "ready"
  | "scheduled"
  | "queued"
  | "publishing"
  | "processing"
  | "published"
  | "failed"
  | "cancelled";