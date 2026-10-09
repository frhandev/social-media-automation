import { Badge } from "@/components/ui/badge";

import type { MediaStatus } from "@/types/media/MediaStatus";
import type { PostLifecycle } from "@/types/post/PostLifecycle";
import type { PostStatus } from "@/types/post/PostStatus";

export type BadgeStatus =
  | PostStatus
  | MediaStatus
  | PostLifecycle
  | "partial";

type BadgeVariant =
  | "default"
  | "info"
  | "success"
  | "destructive"
  | "outline";

type BadgeConfig = {
  label: string;
  variant: BadgeVariant;
};

const MAP: Record<BadgeStatus, BadgeConfig> = {
  // Post statuses
  draft: { label: "Draft", variant: "default" },
  scheduled: { label: "Scheduled", variant: "info" },
  queued: { label: "Queued", variant: "info" },
  publishing: { label: "Publishing", variant: "info" },
  published: { label: "Published", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "outline" },
  partial: { label: "Partial", variant: "info" },

  // Social account statuses
  connected: { label: "Connected", variant: "success" },
  not_connected: { label: "Not connected", variant: "outline" },

  // Media statuses
  uploading: { label: "Uploading", variant: "info" },
  processing: { label: "Processing", variant: "info" },
  ready: { label: "Ready", variant: "success" },
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  const config = MAP[status];

  if (!config) {
    return <Badge variant="outline">Unknown</Badge>;
  }

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}