import type { SocialAccountStatus as AccountStatus } from "@/types/platform/SocialAccountStatus";
import { Badge } from "../ui/badge";

type BadgeVariant = "success" | "outline" | "info" | "destructive";

const STATUS_CONFIG: Record<
  AccountStatus,
  {
    label: string;
    variant: BadgeVariant;
  }
> = {
  connected: {
    label: "Connected",
    variant: "success",
  },
  not_connected: {
    label: "Not connected",
    variant: "outline",
  },
  expired: {
    label: "Expired",
    variant: "info",
  },
  error: {
    label: "Connection error",
    variant: "destructive",
  },
};

type Props = {
  status: AccountStatus;
};

function SocialAccountStatus({ status }: Props) {
  const config = STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default SocialAccountStatus;
