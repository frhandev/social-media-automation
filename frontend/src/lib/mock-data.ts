import MediaItem from "@/types/media/MediaItem";
import { Platform } from "@/types/platform/Platform";
import { PlatformAccount } from "@/types/platform/PlatformAccount";
import { PostRow } from "@/types/post/PostRow";
import { PostStatus } from "@/types/post/PostStatus";

export const workspace = {
  name: "Demo Workspace",
  plan: "Pro",
  others: ["Content Team", "Client Workspace"],
};

export const user = {
  name: "Alex",
  fullName: "Alex Morgan",
  email: "alex@example.com",
  initials: "AM",
};

export const metrics = {
  total: 25,
  drafts: 4,
  scheduled: 5,
  published: 17,
  failed: 3,
};

export type Channel = {
  platform: Platform;
  handle?: string;
  connected: boolean;
};

export const channels: Channel[] = [
  { platform: "youtube", handle: "Demo Channel", connected: true },
  { platform: "tiktok", connected: false },
  { platform: "instagram", handle: "Demo Studio", connected: true },
];

export type UpcomingPost = {
  id: string;
  title: string;
  platforms: Platform[];
  date: string;
  time: string;
  status: PostStatus;
  tile: "lime" | "ink" | "indigo" | "sand";
};

export const upcoming: UpcomingPost[] = [
  {
    id: "1",
    title: "C# Backend Architecture",
    platforms: ["youtube"],
    date: "Today",
    time: "20:00",
    status: "scheduled",
    tile: "ink",
  },
  {
    id: "2",
    title: "Clean Code in 60 Seconds",
    platforms: ["tiktok", "instagram"],
    date: "Tomorrow",
    time: "09:30",
    status: "scheduled",
    tile: "lime",
  },
  {
    id: "3",
    title: "Behind the Studio — Week 14",
    platforms: ["instagram"],
    date: "Thu 2 Oct",
    time: "18:15",
    status: "draft",
    tile: "sand",
  },
  {
    id: "4",
    title: "Postgres Indexing Deep Dive",
    platforms: ["youtube", "instagram"],
    date: "Fri 3 Oct",
    time: "11:00",
    status: "scheduled",
    tile: "indigo",
  },
  {
    id: "5",
    title: "Design Systems for Solo Devs",
    platforms: ["instagram"],
    date: "Sat 4 Oct",
    time: "13:45",
    status: "failed",
    tile: "ink",
  },
];

export type Activity = {
  id: string;
  message: string;
  detail: string;
  time: string;
  tone: "success" | "error" | "info" | "neutral";
};

export const activity: Activity[] = [
  {
    id: "a1",
    message: "YouTube publication succeeded",
    detail: "Dependency Injection Explained",
    time: "12 min ago",
    tone: "success",
  },
  {
    id: "a2",
    message: "Instagram publication failed",
    detail: "Token expired — reconnect the account",
    time: "1 h ago",
    tone: "error",
  },
  {
    id: "a3",
    message: "Post scheduled for tomorrow",
    detail: "Clean Code in 60 Seconds · 09:30",
    time: "3 h ago",
    tone: "info",
  },
  {
    id: "a4",
    message: "Media uploaded",
    detail: "4 files added to the library",
    time: "Yesterday",
    tone: "neutral",
  },
];

// ---------- Media Library (Phase 2) ----------

export const mediaItems: MediaItem[] = [
  {
    id: "m1",
    filename: "backend-tips.mp4",
    type: "video",
    format: "MP4",
    durationSec: 58,
    width: 1080,
    height: 1920,
    sizeBytes: 48_200_000,
    uploadedAt: "2026-09-29T14:20:00Z",
    status: "ready",
    tone: "ink",
  },
  {
    id: "m2",
    filename: "security-reel.mp4",
    type: "video",
    format: "MP4",
    durationSec: 34,
    width: 1080,
    height: 1920,
    sizeBytes: 29_700_000,
    uploadedAt: "2026-09-29T09:05:00Z",
    status: "processing",
    tone: "indigo",
  },
  {
    id: "m3",
    filename: "product-demo.mov",
    type: "video",
    format: "MOV",
    durationSec: 142,
    width: 3840,
    height: 2160,
    sizeBytes: 612_000_000,
    uploadedAt: "2026-09-28T17:42:00Z",
    status: "failed",
    tone: "sand",
  },
  {
    id: "m4",
    filename: "thumbnail-ai.png",
    type: "image",
    format: "PNG",
    width: 1280,
    height: 720,
    sizeBytes: 1_840_000,
    uploadedAt: "2026-09-27T11:10:00Z",
    status: "ready",
    tone: "lime",
  },
  {
    id: "m5",
    filename: "instagram-cover.jpg",
    type: "image",
    format: "JPG",
    width: 1080,
    height: 1350,
    sizeBytes: 920_000,
    uploadedAt: "2026-09-26T08:30:00Z",
    status: "ready",
    tone: "sand",
  },
  {
    id: "m6",
    filename: "launch-teaser.mp4",
    type: "video",
    format: "MP4",
    durationSec: 21,
    width: 1920,
    height: 1080,
    sizeBytes: 18_400_000,
    uploadedAt: "2026-09-24T16:00:00Z",
    status: "ready",
    tone: "indigo",
  },
];

// ---------- Posts (Phase 3) ----------

export const posts: PostRow[] = [
  {
    id: "p1",
    title: "C# Backend Architecture Explained",
    excerpt: "How production ASP.NET Core apps organize layers.",
    platforms: ["youtube"],
    createdAt: "2026-09-29T10:00:00Z",
    scheduledAt: "2026-10-02T15:00:00Z",
    status: "scheduled",
    mediaId: "m1",
  },
  {
    id: "p2",
    title: "3 security mistakes in every API",
    excerpt: "Stop leaking tokens in logs. Here's how.",
    platforms: ["tiktok", "instagram"],
    createdAt: "2026-09-28T12:30:00Z",
    status: "failed",
    mediaId: "m2",
  },
  {
    id: "p3",
    title: "Product demo — v2 launch",
    excerpt: "A full walkthrough of the new dashboard.",
    platforms: ["youtube", "tiktok"],
    createdAt: "2026-09-27T09:15:00Z",
    scheduledAt: "2026-09-28T18:00:00Z",
    status: "published",
    mediaId: "m3",
  },
  {
    id: "p4",
    title: "AI thumbnails that convert",
    excerpt: "Testing 12 AI-generated covers against each other.",
    platforms: ["instagram"],
    createdAt: "2026-09-26T16:40:00Z",
    status: "draft",
    mediaId: "m4",
  },
  {
    id: "p5",
    title: "Launch teaser",
    excerpt: "Something new is coming Friday.",
    platforms: ["tiktok"],
    createdAt: "2026-09-25T08:00:00Z",
    scheduledAt: "2026-09-30T12:00:00Z",
    status: "queued",
    mediaId: "m6",
  },
  {
    id: "p6",
    title: "Weekly dev tips #14",
    excerpt: "Record types, pattern matching and more.",
    platforms: ["youtube", "instagram"],
    createdAt: "2026-09-24T11:20:00Z",
    status: "ready",
    mediaId: "m5",
  },
  {
    id: "p7",
    title: "Clean architecture in 60s",
    excerpt: "The shortest explanation you'll hear.",
    platforms: ["tiktok"],
    createdAt: "2026-09-23T14:05:00Z",
    status: "publishing",
    mediaId: "m1",
  },
  {
    id: "p8",
    title: "Old promo cut",
    excerpt: "Replaced by the v2 launch video.",
    platforms: ["youtube"],
    createdAt: "2026-09-20T10:00:00Z",
    status: "cancelled",
    mediaId: "m3",
  },
];

export const platformAccounts: PlatformAccount[] = [
  { platform: "youtube", account: "Ferhan Dev", connected: true },
  { platform: "tiktok", account: "Ferhan TikTok", connected: true },
  { platform: "instagram", connected: false },
];
