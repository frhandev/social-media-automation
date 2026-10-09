"use client";

import { mediaItems, posts } from "@/lib/mock-data";
import { EmptyState, MediaThumb, Page } from "../shared";
import { PageHeader } from "../layout/PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { PlatformBadge } from "../layout/PlatformBadge";
import { dateKey, formatDate } from "@/lib/helperFunctions";
import { StatusBadge } from "../layout/StatusBadge";
import useFilters from "./useFilters";
import Filters from "./Filters";
import { Platform } from "@/types/platform/Platform";

export function PostsPage() {
  const f = useFilters();
  const rows = posts.filter(
    (p) =>
      [p.title, p.excerpt].some((text) =>
        text.toLowerCase().includes(f.search.trim().toLowerCase()),
      ) &&
      (f.status === "all" || p.status === f.status) &&
      (f.platform === "all" || p.platforms.includes(f.platform as Platform)) &&
      (!f.date || dateKey(p.createdAt) === f.date),
  );

  return (
    <Page>
      <PageHeader
        eyebrow="Content"
        title="Posts"
        description="From a first thought to the final publish. It all starts here."
        action={
          <Button variant="brutal" size="lg" asChild>
            <Link href="/posts/new">
              <Plus size={16} />
              Create post
            </Link>
          </Button>
        }
      />
      <div className="flex flex-wrap gap-7 border-b border-border pb-5">
        <p className="text-xs text-muted-foreground">
          <strong className="mr-2 font-display text-2xl text-foreground">
            {posts.length}
          </strong>
          All posts
        </p>
        <p className="text-xs text-muted-foreground">
          <strong className="mr-2 font-display text-2xl text-foreground">
            {posts.filter((p) => p.status === "draft").length}
          </strong>
          In progress
        </p>
        <p className="text-xs text-muted-foreground">
          <strong className="mr-2 font-display text-2xl text-brand-2">
            {posts.filter((p) => p.status === "scheduled").length}
          </strong>
          On the calendar
        </p>
      </div>
      <Filters f={f} />
      {rows.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {["Post", "Platforms", "Created", "Schedule", "Status", ""].map(
                  (h, i) => (
                    <th key={i}>{h}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/posts/${p.id}`} className="table-title">
                      <MediaThumb
                        media={mediaItems.find((m) => m.id === p.mediaId)}
                        compact
                      />
                      <div className="min-w-0">
                        <strong>{p.title}</strong>
                        <p>{p.excerpt || "Your next idea is taking shape."}</p>
                      </div>
                    </Link>
                  </td>
                  <td data-label="Platforms">
                    <div className="flex gap-1">
                      {p.platforms.length
                        ? p.platforms.map((platform) => (
                            <PlatformBadge
                              key={platform}
                              platform={platform}
                              showLabel={false}
                            />
                          ))
                        : "Not selected"}
                    </div>
                  </td>
                  <td
                    data-label="Created"
                    className="whitespace-nowrap text-subtle"
                  >
                    {formatDate(p.createdAt)}
                  </td>
                  <td
                    data-label="Schedule"
                    className="whitespace-nowrap text-muted-foreground"
                  >
                    {formatDate(p.scheduledAt, true)}
                  </td>
                  <td data-label="Status">
                    <StatusBadge status={p.status} />
                  </td>
                  <td data-label="Actions">
                    <Button variant="ghost" size="iconSm" asChild>
                      <Link
                        aria-label={`View ${p.title}`}
                        href={`/posts/${p.id}`}
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No posts found."
          description="Try a different filter, or turn a fresh idea into your next post."
        />
      )}
      <div className="flex justify-between text-[11px] text-subtle">
        <span>
          {rows.length} of {posts.length} posts
        </span>
        <span>Times shown in Europe/Istanbul</span>
      </div>
    </Page>
  );
}
