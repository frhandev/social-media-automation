import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";

import { PlatformBadge } from "@/components/layout/PlatformBadge";
import { StatusBadge } from "@/components/layout/StatusBadge";

import { formatEventTime } from "@/lib/calendar";
import { CalendarPost } from "@/types/calendar/CalendarPost";

type Props = {
  post: CalendarPost;
  compact?: boolean;
};

function getStatusTone(status: CalendarPost["status"]) {
  switch (status) {
    case "scheduled":
      return "bg-brand-2";
    case "queued":
      return "bg-brand";
    case "published":
      return "bg-success";
    case "failed":
      return "bg-destructive";
    default:
      return "bg-muted-foreground";
  }
}

export default function CalendarEvent({ post, compact = false }: Props) {
  const time = formatEventTime(post.scheduledAt);
  const tone = getStatusTone(post.status);

  if (compact) {
    return (
      <Link
        href={`/posts/${post.id}`}
        title={`${time} · ${post.title} · ${post.status}`}
        aria-label={`View ${post.title} at ${time}, ${post.status}`}
        className="group block min-w-0 rounded-md border border-border bg-secondary/65 px-2 py-2 transition-all hover:border-ink hover:bg-card hover:shadow-brutal-xs"
      >
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={`size-1.5 shrink-0 rounded-full ${tone}`}
          />

          <span className="font-mono text-[10px] font-medium text-muted-foreground">
            {time}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 wrap-break-word text-[11px] font-semibold leading-[1.35] text-foreground">
          {post.title}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1">
          {post.platforms.map((platform) => (
            <PlatformBadge
              key={platform}
              platform={platform}
              showLabel={false}
            />
          ))}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex h-full min-w-0 flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-ink hover:bg-secondary/40 hover:shadow-brutal-xs"
    >
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 shrink-0 rounded-full ${tone}`}
            />
            <span className="flex items-center gap-1 font-mono text-xs font-semibold text-brand-2">
              <Clock3 size={13} />
              {time}
            </span>
          </div>

          <ArrowUpRight
            size={16}
            className="shrink-0 text-subtle group-hover:text-foreground"
          />
        </div>

        <h3 className="line-clamp-2 wrap-break-word font-display text-sm font-bold leading-5">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 wrap-break-word text-xs leading-5 text-muted-foreground">
            {post.excerpt}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
        {post.platforms.map((platform) => (
          <PlatformBadge key={platform} platform={platform} showLabel={false} />
        ))}

        <StatusBadge status={post.status} />
      </div>
    </Link>
  );
}
