import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";

import { PlatformBadge } from "@/components/layout/PlatformBadge";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { Button } from "@/components/ui/button";

import { formatDate } from "@/lib/helperFunctions";

import type { PostRow } from "@/types/post/PostRow";
import type { PublishingRecord } from "@/types/publishing/PublishingRecord";

import PublicationStatusBadge from "./PublicationStatusBadge";

type Props = {
  post: PostRow;
  record: PublishingRecord;
};

export default function PublicationDetails({ post, record }: Props) {
  const attempts = [...record.attempts].sort(
    (a, b) => Date.parse(b.at) - Date.parse(a.at),
  );

  return (
    <div className="space-y-6">
      {/* Publication summary */}
      <div className="rounded-lg border border-border bg-secondary/30 p-4">
        <p className="eyebrow mb-3">PLATFORM PUBLICATION</p>

        <h3 className="wrap-break-word font-display text-lg font-bold">
          {post.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <PlatformBadge platform={record.platform} />

          <PublicationStatusBadge status={record.status} />
        </div>

        <p className="mt-4 font-mono text-[11px] text-subtle">
          Publication ID: {record.id}
        </p>
      </div>

      {/* Timestamps */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <p className="eyebrow mb-2">SCHEDULED AT</p>

          <p className="text-sm font-semibold">
            {formatDate(record.scheduledAt, true, true)}
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="eyebrow mb-2">PUBLISHED AT</p>

          <p className="text-sm font-semibold">
            {formatDate(record.publishedAt, true, true)}
          </p>
        </div>
      </div>

      <p className="flex items-center gap-2 text-[11px] text-subtle">
        <Clock3 size={13} />
        Times displayed in Europe/Istanbul
      </p>

      {/* Attempt history */}
      <section>
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-display text-base font-bold">
            Publishing attempts
          </h3>

          <span className="font-mono text-xs text-subtle">
            {attempts.length}
          </span>
        </div>

        {attempts.length > 0 ? (
          <div className="timeline">
            {attempts.map((attempt, index) => (
              <div key={attempt.id} className="timeline-item">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold text-subtle">
                    ATTEMPT {String(attempts.length - index).padStart(2, "0")}
                  </span>

                  <StatusBadge status={attempt.status} />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(attempt.at, true, true)}
                </p>

                {attempt.error && (
                  <p className="mt-3 wrap-break-word rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs leading-6 text-destructive">
                    {attempt.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
            No publishing attempts recorded.
          </p>
        )}
      </section>

      {/* Backend-only functionality */}
      {record.status === "failed" && (
        <div className="rounded-lg border border-border bg-secondary/40 p-4">
          <p className="text-sm font-semibold">Retry is not available yet.</p>

          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Retrying failed publications requires backend integration. No retry
            is executed in this frontend demo.
          </p>

          <Button variant="outline" size="sm" className="mt-4" disabled>
            Retry — backend required
          </Button>
        </div>
      )}

      <Button asChild variant="outline" className="w-full">
        <Link href={`/posts/${post.id}`}>
          View original post
          <ArrowUpRight size={15} />
        </Link>
      </Button>
    </div>
  );
}

