import type { Platform } from "@/types/platform/Platform";
import type { PublishingStatus } from "./PublishingStatus";
import type { PublishAttempt } from "./PublishAttempt";

export type PublishingRecord = {
  id: string;
  postId: string;
  platform: Platform;
  status: PublishingStatus;

  scheduledAt?: string;
  publishedAt?: string;

  attempts: PublishAttempt[];
};
