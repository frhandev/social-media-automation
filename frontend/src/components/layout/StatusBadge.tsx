import { Badge } from "@/components/ui/badge";

export type PostStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "failed"
  | "connected"
  | "not_connected";

const MAP: Record<
  PostStatus,
  { label: string; variant: "default" | "info" | "success" | "destructive" | "outline" }
> = {
  draft: { label: "Draft", variant: "default" },
  scheduled: { label: "Scheduled", variant: "info" },
  published: { label: "Published", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  connected: { label: "Connected", variant: "success" },
  not_connected: { label: "Not connected", variant: "outline" },
};

export function StatusBadge({ status }: { status: PostStatus }) {
  const { label, variant } = MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
