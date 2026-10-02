import { Music2 } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import type { IconType } from "react-icons";


import { cn } from "@/lib/utils";

export type Platform = "youtube" | "tiktok" | "instagram";

export const PLATFORMS: Record<Platform, { label: string; icon: IconType }> = {
  youtube: { label: "YouTube", icon: FaYoutube },
  tiktok: { label: "TikTok", icon: Music2 },
  instagram: { label: "Instagram", icon: FaInstagram },
};

export function PlatformBadge({
  platform,
  showLabel = true,
  className,
}: {
  platform: Platform;
  showLabel?: boolean;
  className?: string;
}) {
  const { label, icon: Icon } = PLATFORMS[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wide text-foreground",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {showLabel ? label : <span className="sr-only">{label}</span>}
    </span>
  );
}
