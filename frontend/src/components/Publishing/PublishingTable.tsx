import { PublishingRow } from "@/lib/publishing";
import { Button } from "../ui/button";
import Link from "next/dist/client/link";
import { ArrowUpRight, Eye } from "lucide-react";
import PublicationStatusBadge from "./PublicationStatusBadge";
import { formatDate } from "@/lib/helperFunctions";
import { PlatformBadge } from "../layout/PlatformBadge";
import { MediaThumb } from "../shared";
import { mediaItems } from "@/lib/mock-data";

type Props = {
  rows: PublishingRow[];
  onViewDetails: (recordId: string) => void;
};

function PublishingTable({ rows, onViewDetails }: Props) {
  return (
    <div className="table-wrap min-w-0">
      <table className="data-table">
        <thead>
          <tr>
            <th>Post</th>
            <th>Platform</th>
            <th>Scheduled at</th>
            <th>Published at</th>
            <th>Status</th>
            <th>Attempts</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(({ record, post }) => {
            const media = mediaItems.find((item) => item.id === post.mediaId);

            return (
              <tr key={record.id}>
                <td>
                  <Link href={`/posts/${post.id}`} className="table-title">
                    <div className="w-16 shrink-0 overflow-hidden rounded-md">
                      <MediaThumb media={media} compact />
                    </div>

                    <div className="min-w-0">
                      <strong className="wrap-break-word">{post.title}</strong>

                      <p className="text-xs text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </td>

                <td data-label="Platform">
                  <PlatformBadge platform={record.platform} />
                </td>

                <td
                  data-label="Scheduled"
                  className="whitespace-nowrap text-subtle"
                >
                  {formatDate(record.scheduledAt, true, true)}
                </td>

                <td
                  data-label="Published"
                  className="whitespace-nowrap text-subtle"
                >
                  {formatDate(record.publishedAt, true, true)}
                </td>

                <td data-label="Status">
                  <PublicationStatusBadge status={record.status} />
                </td>

                <td data-label="Attempts">
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    {String(record.attempts.length).padStart(2, "0")}
                  </span>
                </td>

                <td data-label="Actions">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(record.id)}
                    aria-label={`View publication details for ${post.title} on ${record.platform}`}
                  >
                    <Eye size={14} />
                    Details
                  </Button>

                  <Button asChild variant="ghost" size="iconSm">
                    <Link
                      href={`/posts/${post.id}`}
                      aria-label={`Open post ${post.title}`}
                    >
                      <ArrowUpRight size={15} />
                    </Link>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PublishingTable;
