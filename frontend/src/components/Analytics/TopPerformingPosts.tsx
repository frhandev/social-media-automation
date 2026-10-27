import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PlatformBadge } from "@/components/layout/PlatformBadge";
import { MediaThumb, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";

import { mediaItems } from "@/lib/mock-data";
import type { TopPerformingPost } from "@/lib/analytics";

type Props = {
  posts: TopPerformingPost[];
};

const numberFormat = new Intl.NumberFormat("en-US");

function formatRate(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

export default function TopPerformingPosts({ posts }: Props) {
  return (
    <section className="min-w-0 space-y-5">
      <div className="flex items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="eyebrow mb-2">TOP CONTENT</p>

          <h2 className="font-display text-xl font-bold">
            Top performing posts
          </h2>

          <p className="mt-2 text-xs text-muted-foreground">
            Ranked by views in the selected period.
          </p>
        </div>

        <span className="text-xs text-subtle">
          Top {Math.min(5, posts.length)}
        </span>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="No performing posts"
          description="No successful publications have analytics for the selected period."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Platforms</th>
                  <th>Views</th>
                  <th>Engagements</th>
                  <th>Rate</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((item) => {
                  const media = mediaItems.find(
                    (m) => m.id === item.post.mediaId,
                  );

                  return (
                    <tr key={item.post.id}>
                      <td>
                        <Link
                          href={`/posts/${item.post.id}`}
                          className="table-title"
                        >
                          <div className="w-14 shrink-0 overflow-hidden rounded-md">
                            <MediaThumb media={media} compact />
                          </div>

                          <div className="min-w-0">
                            <strong className="wrap-break-word">
                              {item.post.title}
                            </strong>

                            <p className="text-xs text-muted-foreground">
                              {item.post.excerpt}
                            </p>
                          </div>
                        </Link>
                      </td>

                      <td data-label="Platforms">
                        <div className="flex flex-wrap gap-1">
                          {item.platforms.map((platform) => (
                            <PlatformBadge
                              key={platform}
                              platform={platform}
                              showLabel={false}
                            />
                          ))}
                        </div>
                      </td>

                      <td
                        data-label="Views"
                        className="font-semibold tabular-nums"
                      >
                        {numberFormat.format(item.views)}
                      </td>

                      <td data-label="Engagements" className="tabular-nums">
                        {numberFormat.format(item.engagements)}
                        {item.hasMissingShares && (
                          <span
                            title="Some shares data is unavailable"
                            className="ml-1 text-subtle"
                          >
                            *
                          </span>
                        )}
                      </td>

                      <td data-label="Rate">
                        {formatRate(item.engagementRate)}
                      </td>

                      <td data-label="Action">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/posts/${item.post.id}`}>
                            View
                            <ArrowUpRight size={14} />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {posts.map((item) => {
              const media = mediaItems.find((m) => m.id === item.post.mediaId);

              return (
                <Link
                  key={item.post.id}
                  href={`/posts/${item.post.id}`}
                  className="block rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 shrink-0 overflow-hidden rounded-md">
                      <MediaThumb media={media} compact />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="wrap-break-word text-sm font-semibold">
                        {item.post.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.platforms.map((platform) => (
                          <PlatformBadge
                            key={platform}
                            platform={platform}
                            showLabel={false}
                          />
                        ))}
                      </div>
                    </div>

                    <ArrowUpRight size={16} className="shrink-0" />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
                    <div>
                      <p className="eyebrow">VIEWS</p>
                      <p className="mt-1 text-sm font-bold">
                        {numberFormat.format(item.views)}
                      </p>
                    </div>

                    <div>
                      <p className="eyebrow">ENGAGEMENTS</p>
                      <p className="mt-1 text-sm font-bold">
                        {numberFormat.format(item.engagements)}
                        {item.hasMissingShares ? "*" : ""}
                      </p>
                    </div>

                    <div>
                      <p className="eyebrow">RATE</p>
                      <p className="mt-1 text-sm font-bold">
                        {formatRate(item.engagementRate)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {posts.some((post) => post.hasMissingShares) && (
            <p className="text-[11px] text-subtle">
              * Engagements and rates use available shares only. Missing shares
              may result in understated totals.
            </p>
          )}
        </>
      )}
    </section>
  );
}
