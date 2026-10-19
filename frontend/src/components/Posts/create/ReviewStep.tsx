import { PlatformBadge } from "@/components/layout/PlatformBadge";
import { MediaThumb, SectionTitle, sizeLabel } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { mediaItems } from "@/lib/mock-data";
import { Platform } from "@/types/platform/Platform";
import { PlatformContent } from "@/types/platform/PlatformContent";
import { Content } from "@/types/post/Content";
import { ArrowUpRight } from "lucide-react";

type ReviewStepProps = {
  mediaId: string;
  platforms: Platform[];
  contents: PlatformContent;

  onEditMedia: () => void;
  onEditPlatforms: () => void;
  onEditContent: () => void;
};

type ContentSummaryProps = {
  platform: Platform;
  content: Content;
};

function ContentSummary({ platform, content }: ContentSummaryProps) {
  const isInstagram = platform === "instagram";

  const titleLabel = platform === "youtube" ? "Title" : "Hook";

  const bodyLabel = platform === "youtube" ? "Description" : "Caption";

  const tagsLabel = platform === "youtube" ? "Tags" : "Hashtags";

  return (
    <article className="min-w-0 space-y-4 border-b border-border pb-6 last:border-0 last:pb-0">
      <PlatformBadge platform={platform} />

      {!isInstagram && (
        <div className="space-y-1">
          <p className="eyebrow">{titleLabel}</p>
          <h3 className="wrap-break-word font-display text-lg font-semibold">
            {content.title}
          </h3>
        </div>
      )}

      <div className="space-y-1">
        <p className="eyebrow">{bodyLabel}</p>
        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-muted-foreground">
          {content.body}
        </p>
      </div>

      {content.tags.trim() && (
        <div className="space-y-1">
          <p className="eyebrow">{tagsLabel}</p>
          <p className="whitespace-pre-wrap wrap-break-word text-sm text-brand-2">
            {content.tags}
          </p>
        </div>
      )}

      {isInstagram && content.cta.trim() && (
        <div className="space-y-1">
          <p className="eyebrow">Call to action</p>
          <p className="wrap-break-word text-sm font-medium">{content.cta}</p>
        </div>
      )}
    </article>
  );
}

export default function ReviewStep({
  mediaId,
  platforms,
  contents,
  onEditMedia,
  onEditPlatforms,
  onEditContent,
}: ReviewStepProps) {
  const media = mediaItems.find((item) => item.id === mediaId);

  return (
    <section className="min-w-0 space-y-6">
      <div>
        <SectionTitle>Review your post</SectionTitle>

        <p className="text-sm text-muted-foreground">
          Make sure everything looks right before continuing.
        </p>
      </div>

      {/* Media */}
      <div className="review-row">
        <p className="eyebrow">Media</p>

        <div className="flex min-w-0 flex-wrap items-center gap-5">
          <div className="w-28 shrink-0 overflow-hidden rounded-lg border border-border">
            <MediaThumb media={media} compact />
          </div>

          <div className="min-w-0 space-y-2">
            {media ? (
              <>
                <p className="break-all text-sm font-semibold">
                  {media.filename}
                </p>

                <p className="text-xs leading-6 text-subtle">
                  {media.type === "video" ? "Video" : "Image"}
                  {" · "}
                  {media.format}
                  {" · "}
                  {media.width} × {media.height}
                </p>

                <p className="text-xs text-subtle">
                  {sizeLabel(media.sizeBytes)}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No media selected.
              </p>
            )}
          </div>
        </div>

        <Button type="button" variant="ghost" size="sm" onClick={onEditMedia}>
          Edit
          <ArrowUpRight size={14} />
        </Button>
      </div>

      {/* Platforms */}
      <div className="review-row">
        <p className="eyebrow">Platforms</p>

        <div className="flex min-w-0 flex-wrap gap-2">
          {platforms.length > 0 ? (
            platforms.map((platform) => (
              <PlatformBadge key={platform} platform={platform} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No platforms selected.
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEditPlatforms}
        >
          Edit
          <ArrowUpRight size={14} />
        </Button>
      </div>

      {/* Platform content */}
      <div className="review-row">
        <p className="eyebrow">Platform content</p>

        <div className="min-w-0 space-y-7">
          {platforms.map((platform) => {
            const content = contents[platform];

            if (!content) {
              return (
                <div key={platform} className="space-y-2">
                  <PlatformBadge platform={platform} />

                  <p className="text-sm text-destructive">
                    Content is missing for this platform.
                  </p>
                </div>
              );
            }

            return (
              <ContentSummary
                key={platform}
                platform={platform}
                content={content}
              />
            );
          })}
        </div>

        <Button type="button" variant="ghost" size="sm" onClick={onEditContent}>
          Edit
          <ArrowUpRight size={14} />
        </Button>
      </div>

      <p className="text-xs leading-6 text-subtle">
        This is a review of your prepared content. No content has been published
        or scheduled.
      </p>
    </section>
  );
}
