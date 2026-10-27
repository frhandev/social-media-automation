import MediaItem from "@/types/media/MediaItem";
import { Platform } from "@/types/platform/Platform";
import { PlatformAccount } from "@/types/platform/PlatformAccount";
import { PostRow } from "@/types/post/PostRow";
import { PostStatus } from "@/types/post/PostStatus";
import { isAccountConnected } from "@/lib/social-accounts";
import { PublishingRecord } from "@/types/publishing/PublishingRecord";
import { AnalyticsDailyRecord } from "@/types/analytics/AnalyticsDailyRecord";
import { WorkspaceMember } from "@/types/settings/WorkspaceMember";

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

export const workspaceMembers: WorkspaceMember[] = [
  {
    id: "member-1",
    name: user.fullName,
    email: user.email,
    role: "owner",
  },
  {
    id: "member-2",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "admin",
  },
  {
    id: "member-3",
    name: "Taylor Chen",
    email: "taylor@example.com",
    role: "member",
  },
];

export const metrics = {
  total: 25,
  drafts: 4,
  scheduled: 5,
  published: 17,
  failed: 3,
};

export const platformAccounts: PlatformAccount[] = [
  {
    platform: "youtube",
    account: "Youtube Channel",
    status: "connected",
  },
  {
    platform: "tiktok",
    account: "TikTok Account",
    status: "connected",
  },
  {
    platform: "instagram",
    status: "not_connected",
  },
];

export type Channel = {
  platform: Platform;
  handle?: string;
  connected: boolean;
};

export const channels: Channel[] = platformAccounts.map((account) => ({
  platform: account.platform,
  handle: account.account,
  connected: isAccountConnected(account),
}));

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
    status: "partial",
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

  {
    id: "p9",
    title: "Creative workflow — Instagram carousel",
    excerpt: "Behind the scenes of a visual content workflow.",
    platforms: ["instagram"],
    createdAt: "2026-08-07T09:00:00Z",
    status: "published",
    mediaId: "m5",
  },
  {
    id: "p10",
    title: "Building Reliable REST APIs",
    excerpt: "Practical techniques for maintainable backend APIs.",
    platforms: ["youtube"],
    createdAt: "2026-08-25T12:00:00Z",
    status: "published",
    mediaId: "m1",
  },
  {
    id: "p11",
    title: "Coding Habits That Save Time",
    excerpt: "Short practical tips for cleaner projects.",
    platforms: ["tiktok"],
    createdAt: "2026-10-02T09:00:00Z",
    status: "published",
    mediaId: "m6",
  },
];

export const publishingRecords: PublishingRecord[] = [
  {
    id: "pub-p1-youtube",
    postId: "p1",
    platform: "youtube",
    status: "scheduled",
    scheduledAt: "2026-10-02T15:00:00Z",
    attempts: [],
  },
  {
    id: "pub-p2-tiktok",
    postId: "p2",
    platform: "tiktok",
    status: "failed",
    attempts: [
      {
        id: "attempt-p2-tiktok-1",
        at: "2026-09-28T12:40:00Z",
        status: "failed",
        error: "Demo error: media processing was incomplete.",
      },
      {
        id: "attempt-p2-tiktok-2",
        at: "2026-09-28T12:45:00Z",
        status: "failed",
        error: "Demo error: media could not be processed.",
      },
      {
        id: "attempt-p2-tiktok-3",
        at: "2026-09-28T13:00:00Z",
        status: "failed",
        error: "Demo error: media processing failed.",
      },
    ],
  },
  {
    id: "pub-p2-instagram",
    postId: "p2",
    platform: "instagram",
    status: "failed",
    attempts: [
      {
        id: "attempt-p2-instagram-1",
        at: "2026-09-28T12:50:00Z",
        status: "failed",
        error: "Demo error: media was unavailable.",
      },
    ],
  },
  {
    id: "pub-p3-youtube",
    postId: "p3",
    platform: "youtube",
    status: "published",
    scheduledAt: "2026-09-28T18:00:00Z",
    publishedAt: "2026-09-28T18:02:00Z",
    attempts: [
      {
        id: "attempt-p3-youtube-1",
        at: "2026-09-28T18:02:00Z",
        status: "published",
      },
    ],
  },
  {
    id: "pub-p3-tiktok",
    postId: "p3",
    platform: "tiktok",
    status: "published",
    scheduledAt: "2026-09-28T18:00:00Z",
    publishedAt: "2026-09-28T18:04:00Z",
    attempts: [
      {
        id: "attempt-p3-tiktok-1",
        at: "2026-09-28T18:04:00Z",
        status: "published",
      },
    ],
  },
  {
    id: "pub-p5-tiktok",
    postId: "p5",
    platform: "tiktok",
    status: "queued",
    scheduledAt: "2026-09-30T12:00:00Z",
    attempts: [],
  },
  {
    id: "pub-p6-youtube",
    postId: "p6",
    platform: "youtube",
    status: "published",
    publishedAt: "2026-10-04T15:00:00Z",
    attempts: [
      {
        id: "attempt-p6-youtube-1",
        at: "2026-10-04T15:00:00Z",
        status: "published",
      },
    ],
  },
  {
    id: "pub-p6-instagram",
    postId: "p6",
    platform: "instagram",
    status: "failed",
    attempts: [
      {
        id: "attempt-p6-instagram-1",
        at: "2026-10-04T15:01:00Z",
        status: "failed",
        error: "Demo error: account authorization was unavailable.",
      },
      {
        id: "attempt-p6-instagram-2",
        at: "2026-10-04T15:06:00Z",
        status: "failed",
        error: "Demo error: authorization must be renewed.",
      },
    ],
  },
  {
    id: "pub-p7-tiktok",
    postId: "p7",
    platform: "tiktok",
    status: "publishing",
    attempts: [],
  },
  {
    id: "pub-p8-youtube",
    postId: "p8",
    platform: "youtube",
    status: "cancelled",
    attempts: [],
  },

  {
    id: "pub-p9-instagram",
    postId: "p9",
    platform: "instagram",
    status: "published",
    publishedAt: "2026-08-12T12:00:00Z",
    attempts: [
      {
        id: "attempt-p9-instagram-1",
        at: "2026-08-12T12:00:00Z",
        status: "published",
      },
    ],
  },
  {
    id: "pub-p10-youtube",
    postId: "p10",
    platform: "youtube",
    status: "published",
    publishedAt: "2026-09-10T10:00:00Z",
    attempts: [
      {
        id: "attempt-p10-youtube-1",
        at: "2026-09-10T10:00:00Z",
        status: "published",
      },
    ],
  },
  {
    id: "pub-p11-tiktok",
    postId: "p11",
    platform: "tiktok",
    status: "published",
    publishedAt: "2026-10-05T10:00:00Z",
    attempts: [
      {
        id: "attempt-p11-tiktok-1",
        at: "2026-10-05T10:00:00Z",
        status: "published",
      },
    ],
  },
];

export const analyticsDailyRecords: AnalyticsDailyRecord[] = [
  // p3 — YouTube: published on 28 September
  {
    publicationId: "pub-p3-youtube",
    date: "2026-09-29",
    views: 800,
    likes: 75,
    comments: 6,
    shares: 4,
  },
  {
    publicationId: "pub-p3-youtube",
    date: "2026-10-03",
    views: 1300,
    likes: 100,
    comments: 14,
    shares: 7,
  },
  {
    publicationId: "pub-p3-youtube",
    date: "2026-10-22",
    views: 1650,
    likes: 129,
    comments: 16,
    shares: 12,
  },
  {
    publicationId: "pub-p3-youtube",
    date: "2026-10-26",
    views: 2100,
    likes: 178,
    comments: 20,
    shares: 13,
  },

  // p3 — TikTok: same post, different publication
  {
    publicationId: "pub-p3-tiktok",
    date: "2026-09-30",
    views: 1700,
    likes: 150,
    comments: 19,
    shares: null,
  },
  {
    publicationId: "pub-p3-tiktok",
    date: "2026-10-09",
    views: 1900,
    likes: 180,
    comments: 18,
    shares: null,
  },
  {
    publicationId: "pub-p3-tiktok",
    date: "2026-10-24",
    views: 2400,
    likes: 250,
    comments: 27,
    shares: null,
  },

  // p6 — YouTube: published, while Instagram failed
  {
    publicationId: "pub-p6-youtube",
    date: "2026-10-05",
    views: 1000,
    likes: 90,
    comments: 12,
    shares: 7,
  },
  {
    publicationId: "pub-p6-youtube",
    date: "2026-10-13",
    views: 1600,
    likes: 130,
    comments: 22,
    shares: 8,
  },
  {
    publicationId: "pub-p6-youtube",
    date: "2026-10-21",
    views: 2300,
    likes: 210,
    comments: 38,
    shares: 16,
  },
  {
    publicationId: "pub-p6-youtube",
    date: "2026-10-25",
    views: 2800,
    likes: 250,
    comments: 45,
    shares: 21,
  },

  // p9 — Instagram: historical data within 90 days
  {
    publicationId: "pub-p9-instagram",
    date: "2026-08-13",
    views: 400,
    likes: 26,
    comments: 4,
    shares: null,
  },
  {
    publicationId: "pub-p9-instagram",
    date: "2026-09-14",
    views: 900,
    likes: 70,
    comments: 9,
    shares: null,
  },
  {
    publicationId: "pub-p9-instagram",
    date: "2026-10-15",
    views: 1500,
    likes: 130,
    comments: 18,
    shares: null,
  },
  {
    publicationId: "pub-p9-instagram",
    date: "2026-10-23",
    views: 1800,
    likes: 145,
    comments: 20,
    shares: null,
  },

  // p10 — YouTube
  {
    publicationId: "pub-p10-youtube",
    date: "2026-09-11",
    views: 0,
    likes: 0,
    comments: 0,
    shares: null,
  },
  {
    publicationId: "pub-p10-youtube",
    date: "2026-09-20",
    views: 650,
    likes: 44,
    comments: 6,
    shares: 5,
  },
  {
    publicationId: "pub-p10-youtube",
    date: "2026-10-08",
    views: 1700,
    likes: 120,
    comments: 16,
    shares: 15,
  },
  {
    publicationId: "pub-p10-youtube",
    date: "2026-10-24",
    views: 2000,
    likes: 160,
    comments: 23,
    shares: 19,
  },

  // p11 — TikTok
  {
    publicationId: "pub-p11-tiktok",
    date: "2026-10-06",
    views: 1200,
    likes: 120,
    comments: 14,
    shares: 19,
  },
  {
    publicationId: "pub-p11-tiktok",
    date: "2026-10-14",
    views: 2400,
    likes: 250,
    comments: 23,
    shares: 35,
  },
  {
    publicationId: "pub-p11-tiktok",
    date: "2026-10-21",
    views: 2800,
    likes: 300,
    comments: 29,
    shares: 45,
  },
  {
    publicationId: "pub-p11-tiktok",
    date: "2026-10-27",
    views: 3500,
    likes: 350,
    comments: 42,
    shares: 50,
  },
];
