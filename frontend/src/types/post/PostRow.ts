import { PostLifecycle } from "./PostLifecycle";

export type PostRow = {
  id: string;
  title: string;
  excerpt: string;
  platforms: ("youtube" | "tiktok" | "instagram")[];
  createdAt: string;
  scheduledAt?: string | undefined;
  status: PostLifecycle | "partial";
  mediaId: string;
};