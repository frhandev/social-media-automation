"use client";

import { useSyncExternalStore } from "react";
import type { Platform } from "@/types/platform/Platform";
import type { PostRow } from "@/types/post/PostRow";
import type { Content } from "@/types/post/Content";
import type { Publication } from "@/types/post/Publication";

/** Frontend-only demo records. No social-media API calls are made. */
export type DemoPost = PostRow & {
  timezone: "Europe/Istanbul";
  content: Partial<Record<Platform, Content>>;
  publications: Publication[];
};

const STORAGE_KEY = "socialflow-ai-demo-posts-v1";
const CHANGED_EVENT = "socialflow-ai-demo-posts-changed";
const EMPTY_POSTS: DemoPost[] = [];
let lastRaw: string | null = null;
let cachedPosts: DemoPost[] = EMPTY_POSTS;

function getSnapshot(): DemoPost[] {
  if (typeof window === "undefined") return EMPTY_POSTS;
  let raw: string;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return EMPTY_POSTS;
  }
  if (raw !== lastRaw) {
    lastRaw = raw;
    try {
      const value: unknown = JSON.parse(raw);
      cachedPosts = Array.isArray(value)
        ? (value as DemoPost[]).filter(
            (p) => p !== null && typeof p === "object" && typeof p.id === "string" && typeof p.title === "string",
          )
        : EMPTY_POSTS;
    } catch {
      cachedPosts = EMPTY_POSTS;
    }
  }
  return cachedPosts;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/** SSR-safe subscription; avoids hydration mismatches caused by localStorage. */
export function useDemoPosts(): DemoPost[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_POSTS);
}

/** Returns true only after successful persistence in this browser. */
export function saveDemoPost(post: DemoPost): void {
  if (typeof window === "undefined") throw new Error("Browser storage is unavailable.");
  const otherPosts = getSnapshot().filter((existing) => existing.id !== post.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([post, ...otherPosts]));
  window.dispatchEvent(new Event(CHANGED_EVENT));
}
