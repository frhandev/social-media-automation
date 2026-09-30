
import { ArrowUpRight, CheckCircle2, Clock, Plus, Upload, XCircle } from "lucide-react";

import { Metric } from "@/components/layout/metric";
import { PageHeader } from "@/components/layout/PageHeader";
import { PLATFORMS, PlatformBadge } from "@/components/layout/PlatformBadge";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activity, channels, metrics, upcoming, user } from "@/lib/mock-data";
import { cn } from "@/lib/utils";


const TILE: Record<string, string> = {
  lime: "bg-brand",
  ink: "bg-ink",
  indigo: "bg-brand-2",
  sand: "bg-secondary",
};

const ACTIVITY_ICON = {
  success: CheckCircle2,
  error: XCircle,
  info: Clock,
  neutral: Upload,
} as const;

const ACTIVITY_TONE = {
  success: "text-success",
  error: "text-destructive",
  info: "text-brand-2",
  neutral: "text-subtle",
} as const;

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <PageHeader
        eyebrow="Overview"
        title={`Good morning, ${user.name}.`}
        description="Here's what's happening with your content."
        action={
          <Button variant="brutal" size="lg" className="w-full sm:w-auto">
            <Plus className="size-4" /> Create post
          </Button>
        }
      />

      {/* Metrics — deliberately unequal hierarchy */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Metric label="Total posts" value={metrics.total} hint="Across all channels" emphasis />
        <div className="grid grid-cols-2 gap-x-6 rounded-lg border border-border bg-card px-2 sm:grid-cols-4">
          <Metric label="Drafts" value={metrics.drafts} hint="Awaiting review" />
          <Metric label="Scheduled" value={metrics.scheduled} hint="Next 7 days" tone="info" />
          <Metric label="Published" value={metrics.published} hint="This month" tone="success" />
          <Metric label="Failed" value={metrics.failed} hint="Needs attention" tone="destructive" />
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-10">
          {/* Upcoming content */}
          <section>
            <div className="mb-4 flex items-baseline justify-between border-b border-border pb-3">
              <h2 className="editorial text-xl">Upcoming content</h2>
              <Button variant="link" size="sm">
                View calendar <ArrowUpRight className="size-3.5" />
              </Button>
            </div>
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {upcoming.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-secondary/50"
                >
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-md border border-ink",
                      TILE[post.tile],
                    )}
                    aria-hidden
                  >
                    <span
                      className={cn(
                        "size-4 rotate-45",
                        post.tile === "ink" || post.tile === "indigo" ? "bg-brand" : "bg-ink",
                      )}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-semibold">
                      {post.title}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {post.platforms.map((p) => (
                        <PlatformBadge key={p} platform={p} />
                      ))}
                      <span className="text-xs text-subtle">
                        {post.date} · {post.time}
                      </span>
                    </span>
                  </span>
                  <StatusBadge status={post.status} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-10">
          {/* Connected channels */}
          <section>
            <div className="mb-4 flex items-baseline justify-between border-b border-border pb-3">
              <h2 className="editorial text-xl">Channels</h2>
              <Badge variant="outline">
                {channels.filter((c) => c.connected).length}/{channels.length}
              </Badge>
            </div>
            <ul className="space-y-3">
              {channels.map((channel) => {
                const { label, icon: Icon } = PLATFORMS[channel.platform];
                return (
                  <li
                    key={channel.platform}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <span className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="block truncate text-xs text-subtle">
                        {channel.handle ?? "No account linked"}
                      </span>
                    </span>
                    {channel.connected ? (
                      <StatusBadge status="connected" />
                    ) : (
                      <Button variant="brutalDark" size="sm">
                        Connect
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Recent activity */}
          <section>
            <h2 className="editorial mb-4 border-b border-border pb-3 text-xl">
              Recent activity
            </h2>
            <ul className="space-y-5 border-l border-border pl-5">
              {activity.map((item) => {
                const Icon = ACTIVITY_ICON[item.tone];
                return (
                  <li key={item.id} className="relative">
                    <span className="absolute -left-[1.6875rem] top-0.5 flex size-4 items-center justify-center rounded-full bg-background">
                      <Icon className={cn("size-3.5", ACTIVITY_TONE[item.tone])} aria-hidden />
                    </span>
                    <p className="text-sm font-medium leading-snug">{item.message}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                    <p className="mt-0.5 text-xs text-subtle">{item.time}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;