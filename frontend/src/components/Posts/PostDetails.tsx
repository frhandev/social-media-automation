"use client";

import { mediaItems, posts, workspace } from "@/lib/mock-data";
import { useState } from "react";
import { EmptyState, MediaFacts, MediaThumb, Modal, Page, SectionTitle } from "../shared";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarClock, CheckCircle2, RotateCw, TriangleAlert } from "lucide-react";
import { PageHeader } from "../layout/PageHeader";
import { formatDate } from "@/lib/helperFunctions";
import { StatusBadge } from "../layout/StatusBadge";
import { useRouter } from "next/navigation";
import { PlatformBadge } from "../layout/PlatformBadge";

function PostDetails({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [cancel, setCancel] = useState(false);
  const post = posts.find((p) => p.id === id);

//To do: Loading state
//   if (!ready)
//     return (
//       <Page>
//         <Skeleton className="h-96" />
//       </Page>
//     );

  if (!post)
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
  const media = mediaItems.find((m) => m.id === post.mediaId);
  function editDraft() {
    if (!post) return;
    console.log("Task editing will enabled soon...");
    router.push("/posts/new");
  }
  return (
    <Page>
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground"
      >
        <ArrowLeft size={13} />
        All posts
      </Link>
      <PageHeader
        eyebrow="Post details"
        title={post.title}
        description={
          <>
            Created {formatDate(post.createdAt)} · {workspace.name}
          </>
        }
        action={
          <div className="flex flex-col items-end gap-4">
            <StatusBadge status={post.status} />
            {post.status === "draft" && (
              <Button variant="brutal" onClick={editDraft}>
                Continue editing <ArrowUpRight size={14} />
              </Button>
            )}
            {post.status === "scheduled" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancel(true)}
              >
                Cancel schedule
              </Button>
            )}
          </div>
        }
      />
      {post.status === "partial" && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4 text-xs leading-6">
          <TriangleAlert size={17} className="mt-1 shrink-0" />
          <p>
            Some channels need attention. Successful publications are
            unaffected. Review each channel’s status below.
          </p>
        </div>
      )}
      <div className="editor-layout">
        <div className="space-y-8">
          <section>
            <SectionTitle>Platform publications</SectionTitle>
            {/* {post.publications.length ? (
              <div className="space-y-3">
                {post.publications.map((pub) => (
                  <div className="panel" key={pub.platform}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <PlatformBadge platform={pub.platform} />
                      <StatusBadge status={pub.status} />
                    </div>
                    <p className="mt-4 text-sm font-semibold">
                      {post.content[pub.platform].title || post.title}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">
                      {post.content[pub.platform].body || post.excerpt}
                    </p>
                    {pub.publishedAt && (
                      <p className="mt-4 flex items-center gap-2 text-xs text-success">
                        <CheckCircle2 size={13} />
                        Published{" "}
                        {formatDate(pub.publishedAt, true)}
                      </p>
                    )}
                    {pub.error && (
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                        <p className="text-xs text-destructive">{pub.error}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setError(pub.error!)}
                          >
                            View details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log("will Activated soon...")}
                          >
                            <RotateCw size={12} />
                            Retry
                          </Button>
                        </div>
                      </div>
                    )}
                    {pub.status === "queued" && (
                      <Button
                        className="mt-4"
                        size="sm"
                        variant="outline"
                        onClick={() => console.log("will Activated soon...")}
                      >
                        Run demo publication <ArrowUpRight size={12} />
                      </Button>
                    )}
                    {pub.status === "publishing" && (
                      <p
                        role="status"
                        className="mt-4 flex items-center gap-2 text-xs text-brand-2"
                      >
                        <RotateCw size={12} className="animate-spin" />
                        Publishing simulation in progress…
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Choose your channels."
                description="Continue editing this draft to add your platforms."
              />
            )} */}
          </section>
          <section>
            <SectionTitle>Publish attempts</SectionTitle>
            {/* {post.publications.some((p) => p.attempts.length) ? (
              <div className="timeline">
                {post.publications.flatMap((pub) =>
                  pub.attempts.map((attempt, i) => (
                    <div className="timeline-item" key={attempt.id}>
                      <div className="flex flex-wrap items-center gap-3">
                        <PlatformBadge platform={pub.platform} />
                        <span className="font-mono text-[10px] text-subtle">
                          ATTEMPT{" "}
                          {String(pub.attempts.length - i).padStart(2, "0")}
                        </span>
                        <StatusBadge status={attempt.status} />
                      </div>
                      <p className="mt-2 font-mono text-[11px] text-subtle">
                        {formatDate(attempt.at, true)}
                      </p>
                      {attempt.error && (
                        <p className="mt-2 text-xs text-destructive">
                          {attempt.error}
                        </p>
                      )}
                    </div>
                  )),
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No publishing attempts yet. This timeline will track each
                channel independently.
              </p>
            )} */}
          </section>
        </div>
        <aside className="space-y-7">
          <section>
            <SectionTitle>Media</SectionTitle>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <MediaThumb media={media} playback />
              {media && (
                <div className="space-y-5 p-5">
                  <p className="break-all text-sm font-semibold">
                    {media.filename}
                  </p>
                  <MediaFacts media={media} />
                </div>
              )}
            </div>
          </section>
          <section className="panel">
            <div className="mb-5 flex items-center gap-2">
              <CalendarClock size={17} />
              <h2 className="font-display font-semibold">
                Publishing schedule
              </h2>
            </div>
            <p className="font-display text-xl font-bold">
              {post.scheduledAt
                ? formatDate(post.scheduledAt, true)
                : "No scheduled time"}
            </p>
            <p className="mt-2 text-xs text-subtle">Istanbul/Europe</p>
            <p className="mt-5 border-t border-border pt-4 text-xs leading-6 text-muted-foreground">
              {post.status === "cancelled"
                ? "This scheduled publication has been cancelled."
                : post.status === "draft"
                  ? "Save your idea now. Find the right moment later."
                  : "This is a local simulation. No content is sent to social platforms."}
            </p>
          </section>
        </aside>
      </div>
      <Modal
        open={!!error}
        onOpenChange={() => setError(null)}
        title="Publication details"
        description="This error only affects the selected channel."
      >
        <p className="error-note">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/social-accounts">
            Manage social accounts <ArrowUpRight size={14} />
          </Link>
        </Button>
      </Modal>
      <Modal
        open={cancel}
        onOpenChange={setCancel}
        title="Cancel this schedule?"
        description="The post and its content will remain in your workspace."
      >
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setCancel(false)}>
            Keep schedule
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
            //   update((s) => ({
            //     ...s,
            //     posts: s.posts.map((p) =>
            //       p.id === id
            //         ? {
            //             ...p,
            //             status: "cancelled",
            //             publications: p.publications.map((pub) => ({
            //               ...pub,
            //               status: "cancelled",
            //             })),
            //           }
            //         : p,
            //     ),
            //   }));
              setCancel(false);
            //   notify("Schedule cancelled.");
            }}
          >
            Cancel schedule
          </Button>
        </div>
      </Modal>
    </Page>
  );
}

export default PostDetails;
