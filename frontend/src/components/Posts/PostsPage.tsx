"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { mediaItems, posts } from "@/lib/mock-data";
import { useDemoPosts } from "@/lib/demo-posts";
import { dateKey, formatDate } from "@/lib/helperFunctions";
import { PlatformBadge } from "../layout/PlatformBadge";
import { PageHeader } from "../layout/PageHeader";
import { StatusBadge } from "../layout/StatusBadge";
import { EmptyState, MediaThumb, Page } from "../shared";
import { Button } from "../ui/button";
import Filters from "./Filters";
import useFilters from "./useFilters";
import type { Platform } from "@/types/platform/Platform";

export function PostsPage() {
  const demoPosts = useDemoPosts();
  const allPosts = [...demoPosts, ...posts];
  const f = useFilters();
  const rows = allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(f.search.toLowerCase()) &&
      (f.status === "all" || post.status === f.status) &&
      (f.platform === "all" ||
        post.platforms.includes(f.platform as Platform)) &&
      (!f.date || dateKey(post.createdAt) === f.date),
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
              <Plus size={16} /> Create post
            </Link>
          </Button>
        }
      />
      <div className="flex flex-wrap gap-7 border-b border-border pb-5">
        <p className="text-xs text-muted-foreground">
          <strong className="mr-2 font-display text-2xl text-foreground">
            {allPosts.length}
          </strong>
          All posts
        </p>
        <p className="text-xs text-muted-foreground">
          <strong className="mr-2 font-display text-2xl text-foreground">
            {allPosts.filter((p) => p.status === "draft").length}
          </strong>
          In progress
        </p>
        <p className="text-xs text-muted-foreground">
          <strong className="mr-2 font-display text-2xl text-brand-2">
            {allPosts.filter((p) => p.status === "scheduled").length}
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
                  (heading, index) => (
                    <th key={index}>{heading}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/posts/${post.id}`} className="table-title">
                      <MediaThumb
                        media={mediaItems.find((m) => m.id === post.mediaId)}
                        compact
                      />
                      <div className="min-w-0">
                        <strong>{post.title}</strong>
                        <p>
                          {post.excerpt || "Your next idea is taking shape."}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td data-label="Platforms">
                    <div className="flex flex-wrap gap-1">
                      {post.platforms.length
                        ? post.platforms.map((p) => (
                            <PlatformBadge
                              key={p}
                              platform={p}
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
                    {formatDate(post.createdAt)}
                  </td>
                  <td
                    data-label="Schedule"
                    className="whitespace-nowrap text-muted-foreground"
                  >
                    {formatDate(post.scheduledAt, true)}
                  </td>
                  <td data-label="Status">
                    <StatusBadge status={post.status} />
                  </td>
                  <td data-label="Actions">
                    <Button variant="ghost" size="iconSm" asChild>
                      <Link
                        aria-label={`View ${post.title}`}
                        href={`/posts/${post.id}`}
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
          description="Try a different filter, or start creating content."
        />
      )}
      <div className="flex justify-between text-[11px] text-subtle">
        <span>
          {rows.length} of {allPosts.length} posts
        </span>
        <span>Times shown in Europe/Istanbul · LOCAL DEMO</span>
      </div>
    </Page>
  );
}
