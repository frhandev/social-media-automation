import { ContentErrors } from "@/types/platform/ContentErrors";
import { Platform } from "@/types/platform/Platform";
import { PlatformContent } from "@/types/platform/PlatformContent";
import { Content } from "@/types/post/Content";

export function formatDate(
  value?: string,
  includeTime = false,
  includeYear = false,
) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    day: "numeric",
    month: "short",
    ...(includeYear && { year: "numeric" }),
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }).format(new Date(value));
}

export function dateKey(value: string, timezone = "Europe/Istanbul") {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  }).format(new Date(value));
}



export function validatePlatformContent(
  platform: Platform,
  content: Content,
): ContentErrors {
  const errors: ContentErrors = {};

  if (platform === "youtube") {
    if (!content.title.trim()) {
      errors.title = "YouTube title is required.";
    }

    if (!content.body.trim()) {
      errors.body = "YouTube description is required.";
    }
  }

  if (platform === "tiktok") {
    if (!content.title.trim()) {
      errors.title = "TikTok hook is required.";
    }

    if (!content.body.trim()) {
      errors.body = "TikTok caption is required.";
    }
  }

  if (platform === "instagram") {
    if (!content.body.trim()) {
      errors.body = "Instagram caption is required.";
    }
  }

  return errors;
}


const EMPTY_CONTENT: Content = {
  title: "",
  body: "",
  tags: "",
  cta: "",
};

export function validateAllPlatformContents(
  platforms: Platform[],
  contents: PlatformContent,
): boolean {
  return platforms.length > 0 && platforms.every((platform) => {
    const content = contents[platform] ?? EMPTY_CONTENT;

    return (
      Object.keys(
        validatePlatformContent(platform, content),
      ).length === 0
    );
  });
}

