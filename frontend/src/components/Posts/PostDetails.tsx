import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";

import { mediaItems, posts, workspace } from "@/lib/mock-data";
import { PageHeader } from "../layout/PageHeader";
import { PlatformBadge } from "../layout/PlatformBadge";
import { StatusBadge } from "../layout/StatusBadge";
import {
  EmptyState,
  MediaFacts,
  MediaThumb,
  Page,
  SectionTitle,
} from "../shared";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/helperFunctions";

const TIME_ZONE = "Europe/Istanbul";

export default function PostDetails({ id }: { id: string }) {
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <Page>
        <EmptyState
          title="Post not found."
          description="This post is not available in this demo workspace."
          action={
            <Button asChild variant="outline">
              <Link href="/posts">Back to posts</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const media = mediaItems.find((m) => m.id === post.mediaId);

  return (
    <Page>
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      <PageHeader
        eyebrow="Post details"
        title={post.title}
        description={
          <>
            Created {formatDate(post.createdAt, false, true)} · {workspace.name}
          </>
        }
        action={<StatusBadge status={post.status} />}
      />

      <div className="editor-layout">
        <div className="space-y-8">
          <section className="panel">
            <SectionTitle>Post information</SectionTitle>

            <p className="text-sm leading-7 text-muted-foreground">
              {post.excerpt || "No description provided."}
            </p>

            <div className="mt-6 border-t border-border pt-5">
              <h3 className="mb-3 text-xs font-semibold">Target platforms</h3>

              <div className="flex flex-wrap gap-2">
                {post.platforms.length ? (
                  post.platforms.map((platform) => (
                    <PlatformBadge key={platform} platform={platform} />
                  ))
                ) : (
                  <p className="text-xs text-subtle">No platforms selected.</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>Media</SectionTitle>

            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <MediaThumb media={media} playback />

              {media ? (
                <div className="space-y-5 p-5">
                  <p className="break-all text-sm font-semibold">
                    {media.filename}
                  </p>
                  <MediaFacts media={media} />
                </div>
              ) : (
                <p className="p-5 text-xs text-muted-foreground">
                  No media available for this post.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-7">
          <section className="panel">
            <div className="mb-5 flex items-center gap-2">
              <CalendarClock size={17} />
              <h2 className="font-display font-semibold">
                Publishing schedule
              </h2>
            </div>

            <p className="font-display text-xl font-bold">
              {formatDate(post.scheduledAt, true, true)}
            </p>

            <p className="mt-2 text-xs text-subtle">
              Demo timezone: {TIME_ZONE}
            </p>
          </section>

          <section className="panel">
            <SectionTitle>Details</SectionTitle>

            <dl className="facts">
              <div>
                <dt>Post ID</dt>
                <dd>{post.id}</dd>
              </div>

              <div>
                <dt>Created</dt>
                <dd>{formatDate(post.createdAt, true, true)}</dd>
              </div>

              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={post.status} />
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </Page>
  );
}
