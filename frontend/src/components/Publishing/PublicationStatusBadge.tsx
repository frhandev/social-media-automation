import { StatusBadge } from "@/components/layout/StatusBadge";

import type { PublishingStatus } from "@/types/publishing/PublishingStatus";

type Props = {
  status: PublishingStatus;
};

export default function PublicationStatusBadge({ status }: Props) {
  return <StatusBadge status={status} />;
}
