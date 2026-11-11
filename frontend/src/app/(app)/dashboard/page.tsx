import Link from "next/link";

import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Plus,
  XCircle,
} from "lucide-react";

import { Metric } from "@/components/layout/metric";
import { PageHeader } from "@/components/layout/PageHeader";
import { PLATFORMS, PlatformBadge } from "@/components/layout/PlatformBadge";
import { StatusBadge } from "@/components/layout/StatusBadge";
import SocialAccountStatus from "@/components/SocialAccounts/SocialAccountStatus";

import { EmptyState } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  posts,
  publishingRecords,
  platformAccounts,
  user,
} from "@/lib/mock-data";

import {
  getDashboardMetrics,
  getUpcomingPosts,
  getRecentPublishingActivity,
} from "@/lib/dashboard";

import { formatDate } from "@/lib/helperFunctions";
import { isAccountConnected } from "@/lib/social-accounts";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const metrics = getDashboardMetrics(posts);
  const upcoming = getUpcomingPosts(posts);
  const activity = getRecentPublishingActivity(publishingRecords, posts);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome, ${user.name}.`}
        description="Explore your content and sample publishing activity."
        action={
          <Button variant="brutal" size="lg" asChild>
            <Link href="/posts/new">
              <Plus size={16} />
              Create post
            </Link>
          </Button>
        }
      />

      {/* Post metrics */}
      <section className="space-y-3">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Metric
            label="Total posts"
            value={metrics.total}
            hint="Unique content records"
            emphasis
          />

          <div className="grid grid-cols-2 gap-x-6 rounded-lg border border-border bg-card px-2 sm:grid-cols-4">
            <Metric label="Drafts" value={metrics.drafts} hint="Draft posts" />
            <Metric
              label="Scheduled"
              value={metrics.scheduled}
              hint="All scheduled posts"
              tone="info"
            />
            <Metric
              label="Published"
              value={metrics.published}
              hint="Published posts"
              tone="success"
            />
            <Metric
              label="Failed"
              value={metrics.failed}
              hint="Failed posts"
              tone="destructive"
            />
          </div>
        </div>

        <p className="text-xs leading-6 text-muted-foreground">
          These counts represent posts, not individual platform publications.
          The demo contains {publishingRecords.length} platform publication
          records. Queued, publishing, partial, and cancelled posts are also
          included in Total posts.
        </p>
      </section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          {/* Upcoming content */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
              <h2 className="editorial text-xl">Upcoming content</h2>
              <Button variant="link" size="sm" asChild>
                <Link href="/calendar">
                  View calendar
                  <ArrowUpRight size={14} />
                </Link>
              </Button>
            </div>

            {upcoming.length > 0 ? (
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                {upcoming.map((post) => (
                  <li key={post.id} className="flex items-center gap-4 p-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
                      <CalendarClock size={20} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/posts/${post.id}`}
                        className="block truncate text-sm font-semibold hover:underline"
                      >
                        {post.title}
                      </Link>

                      <p className="mt-1 text-xs text-subtle">
                        {formatDate(post.scheduledAt, true, true)}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.platforms.map((platform) => (
                          <PlatformBadge
                            key={platform}
                            platform={platform}
                            showLabel={false}
                          />
                        ))}
                      </div>
                    </div>

                    <StatusBadge status={post.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No upcoming posts"
                description="There are no future scheduled or queued posts in the demo data."
                action={
                  <Button asChild variant="outline">
                    <Link href="/calendar">View calendar</Link>
                  </Button>
                }
              />
            )}
          </section>
        </div>

        <div className="min-w-0 space-y-10">
          {/* Connected accounts */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
              <h2 className="editorial text-xl">Channels</h2>

              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  {platformAccounts.filter(isAccountConnected).length}/
                  {platformAccounts.length}
                </Badge>

                <Link
                  href="/social-accounts"
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                >
                  Manage
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            <ul className="space-y-3">
              {platformAccounts.map((account) => {
                const { icon: Icon, label } = PLATFORMS[account.platform];

                return (
                  <li
                    key={account.platform}
                    className="flex min-w-0 flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
                      <Icon size={16} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="truncate text-xs text-subtle">
                        {account.account || "No account linked"}
                      </p>
                    </div>

                    <SocialAccountStatus status={account.status} />
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Dated publishing activity */}
          <section>
            <h2 className="editorial mb-4 border-b border-border pb-3 text-xl">
              Publishing activity
            </h2>

            {activity.length > 0 ? (
              <ul className="space-y-4">
                {activity.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-2">
                      {item.status === "published" ? (
                        <CheckCircle2 size={16} className="text-success" />
                      ) : (
                        <XCircle size={16} className="text-destructive" />
                      )}

                      <p className="text-xs font-semibold">
                        {item.platform} · {item.status}
                      </p>
                    </div>

                    <Link
                      href={`/posts/${item.post.id}`}
                      className="mt-2 block wrap-break-word text-sm font-medium hover:underline"
                    >
                      {item.post.title}
                    </Link>

                    <p className="mt-1 text-xs text-subtle">
                      {formatDate(item.occurredAt, true, true)}
                    </p>

                    {item.error && (
                      <p className="mt-2 wrap-break-word text-xs text-destructive">
                        {item.error}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recorded publishing activity.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
