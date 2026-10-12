"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { mediaItems, posts, workspace } from "@/lib/mock-data";
import { useDemoPosts } from "@/lib/demo-posts";
import { formatDate } from "@/lib/helperFunctions";
import { PageHeader } from "../layout/PageHeader";
import { PlatformBadge } from "../layout/PlatformBadge";
import { StatusBadge } from "../layout/StatusBadge";
import { EmptyState, MediaFacts, MediaThumb, Page, SectionTitle } from "../shared";
import { Button } from "../ui/button";

export default function PostDetails({ id }: { id: string }) {
  const demoPosts = useDemoPosts();
  const demoPost = demoPosts.find((p) => p.id === id);
  const post = demoPost ?? posts.find((p) => p.id === id);

  if (!post) {
    return (
      <Page>
        <EmptyState
          title="Post not found."
          description="This post is not available in this demo workspace."
          action={<Button asChild variant="outline"><Link href="/posts">Back to posts</Link></Button>}
        />
      </Page>
    );
  }

  const media = mediaItems.find((m) => m.id === post.mediaId);
  const preparedContent = demoPost?.content;

  return (
    <Page>
      <Link href="/posts" className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowLeft size={14} /> All posts
      </Link>
      <PageHeader
        eyebrow="Post details"
        title={post.title}
        description={<>Created {formatDate(post.createdAt, false, true)} · {workspace.name}</>}
        action={<StatusBadge status={post.status} />}
      />
      <div className="editor-layout">
        <div className="space-y-8">
          <section className="panel">
            <SectionTitle>Post information</SectionTitle>
            <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {post.excerpt || "No description provided."}
            </p>
            <div className="mt-6 border-t border-border pt-5">
              <h3 className="mb-3 text-xs font-semibold">Target platforms</h3>
              <div className="flex flex-wrap gap-2">
                {post.platforms.length
                  ? post.platforms.map((platform) => <PlatformBadge key={platform} platform={platform} />)
                  : <p className="text-xs text-subtle">No platforms selected.</p>}
              </div>
            </div>
          </section>
          {preparedContent && post.platforms.length > 0 && (
            <section className="panel">
              <SectionTitle>Prepared platform content</SectionTitle>
              <div className="space-y-6">
                {post.platforms.map((platform) => {
                  const content = preparedContent[platform];
                  if (!content) return null;
                  return (
                    <div key={platform} className="space-y-2 border-b border-border pb-5 last:border-0 last:pb-0">
                      <PlatformBadge platform={platform} />
                      {content.title && <h3 className="font-display text-lg font-semibold">{content.title}</h3>}
                      <p className="whitespace-pre-wrap wrap-break-word text-xs leading-6 text-muted-foreground">{content.body}</p>
                      {content.tags && <p className="wrap-break-word text-xs text-brand-2">{content.tags}</p>}
                      {content.cta && <p className="text-xs font-medium">{content.cta}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          <section>
            <SectionTitle>Media</SectionTitle>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <MediaThumb media={media} playback />
              {media ? (
                <div className="space-y-5 p-5">
                  <p className="break-all text-sm font-semibold">{media.filename}</p>
                  <MediaFacts media={media} />
                </div>
              ) : (
                <p className="p-5 text-xs text-muted-foreground">No media available for this post.</p>
              )}
            </div>
          </section>
        </div>
        <aside className="space-y-7">
          <section className="panel">
            <div className="mb-5 flex items-center gap-2">
              <CalendarClock size={17} />
              <h2 className="font-display font-semibold">Publishing schedule</h2>
            </div>
            <p className="font-display text-xl font-bold">
              {post.scheduledAt ? formatDate(post.scheduledAt, true, true) : "No scheduled time"}
            </p>
            <p className="mt-2 text-xs text-subtle">Demo timezone: Europe/Istanbul</p>
          </section>
          <section className="panel">
            <SectionTitle>Details</SectionTitle>
            <dl className="facts">
              <div><dt>Post ID</dt><dd className="break-all">{post.id}</dd></div>
              <div><dt>Created</dt><dd>{formatDate(post.createdAt, true, true)}</dd></div>
              <div><dt>Status</dt><dd><StatusBadge status={post.status} /></dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </Page>
  );
}
