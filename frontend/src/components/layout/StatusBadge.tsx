import { Badge } from "@/components/ui/badge";
import { MediaStatus } from "@/types/media/MediaStatus";
import { PostStatus } from "@/types/post/PostStatus";

export type BadgeStatus = PostStatus | MediaStatus;

type BadgeVariant =
  | "default"
  | "info"
  | "success"
  | "destructive"
  | "outline";

const MAP: Record<
  BadgeStatus,
  { label: string; variant: BadgeVariant }
> = {
  draft: { label: "Draft", variant: "default" },
  scheduled: { label: "Scheduled", variant: "info" },
  published: { label: "Published", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  connected: { label: "Connected", variant: "success" },
  not_connected: { label: "Not connected", variant: "outline" },
  uploading: { label: "Uploading", variant: "info" },
  processing: { label: "Processing", variant: "info" },
  ready: { label: "Ready", variant: "success" },
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  const { label, variant } = MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
