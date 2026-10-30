import Link from "next/link";

import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  SquarePen,
} from "lucide-react";

import { StatusBadge } from "@/components/layout/StatusBadge";
import { metrics, posts } from "@/lib/mock-data";

const PREVIEW_METRICS = [
  { label: "Total posts", value: metrics.total },
  { label: "Scheduled", value: metrics.scheduled },
  { label: "Published", value: metrics.published },
  { label: "Drafts", value: metrics.drafts },
];

const PREVIEW_NAV = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Posts", icon: SquarePen },
  { label: "Calendar", icon: CalendarDays },
  { label: "Analytics", icon: BarChart3 },
];

const WEEK_DAYS = [
  { label: "Mon", active: false },
  { label: "Tue", active: true },
  { label: "Wed", active: false },
  { label: "Thu", active: true },
  { label: "Fri", active: true },
  { label: "Sat", active: false },
  { label: "Sun", active: false },
];

export default function DashboardPreview() {
  const previewPosts = posts.slice(0, 3);

  return (
    <section
      id="preview"
      aria-labelledby="preview-title"
      className="scroll-mt-24 border-b border-border px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">YOUR WORKSPACE, SIMPLIFIED</p>

            <h2
              id="preview-title"
              className="max-w-2xl font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl"
            >
              Less tab switching.
              <br />
              More creating.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              One place to explore content, publishing statuses, and performance
              in an interactive frontend demo.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold underline decoration-brand-2 underline-offset-4 transition-colors hover:text-brand-2"
          >
            Open full demo
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Application preview window */}
        <div className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-brutal">
          {/* Browser chrome */}
          <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/65 px-4 py-3 sm:px-6">
            <div aria-hidden="true" className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive/65" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
            </div>

            <p className="font-mono text-[10px] text-muted-foreground sm:text-xs">
              SocialFlow AI / Demo workspace
            </p>

            <span className="hidden rounded border border-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-widest sm:inline-block">
              Demo preview
            </span>
          </div>

          <div className="grid lg:grid-cols-[190px_minmax(0,1fr)]">
            {/* Mock sidebar */}
            <aside className="hidden border-r border-border bg-background p-4 lg:block">
              <p className="mb-6 px-2 font-display text-sm font-bold">
                SOCIALFLOW
                <span className="text-brand-2">.</span>
              </p>

              <div className="space-y-1">
                {PREVIEW_NAV.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 rounded-md px-3 py-3 text-xs font-semibold ${
                        index === 0
                          ? "border border-ink bg-brand text-ink"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Icon size={15} />
                      {item.label}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 rounded-md border border-dashed border-border p-3">
                <p className="eyebrow">PREVIEW MODE</p>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Illustrative interface with mock data.
                </p>
              </div>
            </aside>

            {/* Mock dashboard content */}
            <div className="min-w-0 p-4 sm:p-7">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="eyebrow mb-2">OVERVIEW</p>

                  <h3 className="font-display text-xl font-bold sm:text-2xl">
                    Your content at a glance.
                  </h3>
                </div>

                <span className="rounded-md bg-brand px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ink">
                  Sample workspace
                </span>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PREVIEW_METRICS.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`min-w-0 rounded-lg border p-3 sm:p-4 ${
                      index === 0
                        ? "border-ink bg-brand"
                        : "border-border bg-background"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {metric.label}
                    </p>

                    <p className="mt-4 font-display text-2xl font-bold tabular-nums sm:text-3xl">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
                {/* Sample posts */}
                <div className="min-w-0 rounded-lg border border-border bg-background p-4">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h4 className="font-display text-sm font-bold">
                      Content overview
                    </h4>

                    <SquarePen size={15} className="text-subtle" />
                  </div>

                  <div className="divide-y divide-border">
                    {previewPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex min-w-0 items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {post.title}
                          </p>

                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {post.platforms.length} channel
                            {post.platforms.length === 1 ? "" : "s"}
                          </p>
                        </div>

                        <StatusBadge status={post.status} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Illustrative mini calendar */}
                <div className="min-w-0 rounded-lg border border-border bg-background p-4">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h4 className="font-display text-sm font-bold">
                      Content calendar
                    </h4>

                    <CalendarDays size={15} className="text-subtle" />
                  </div>

                  <p className="mb-4 text-[10px] uppercase tracking-wide text-subtle">
                    Illustrative week
                  </p>

                  <div className="grid grid-cols-7 gap-1.5">
                    {WEEK_DAYS.map((day) => (
                      <div key={day.label} className="min-w-0 text-center">
                        <p className="text-[9px] font-medium text-muted-foreground">
                          {day.label.slice(0, 1)}
                        </p>

                        <div
                          aria-label={
                            day.active
                              ? `${day.label}: sample content marker`
                              : `${day.label}: no sample marker`
                          }
                          className={`mt-2 flex h-10 items-center justify-center rounded-md border ${
                            day.active
                              ? "border-ink bg-brand"
                              : "border-border bg-card"
                          }`}
                        >
                          {day.active && (
                            <span className="size-1.5 rounded-full bg-ink" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="size-2 rounded-full bg-brand-2" />
                    Sample planning layout
                  </div>
                </div>
              </div>

              <p className="mt-5 text-right text-[10px] text-muted-foreground">
                Demo UI · Sample content and metrics · Not live analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
