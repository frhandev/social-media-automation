import { PlatformBadge, PLATFORMS } from "@/components/layout/PlatformBadge";
import { MediaThumb, SectionTitle } from "@/components/shared";
import MediaItem from "@/types/media/MediaItem";
import { Platform } from "@/types/platform/Platform";
import { Content } from "@/types/post/Content";

type Props = {
  platform: Platform;
  content: Content;
  media?: MediaItem;
};

function PlatformContentPreview({ platform, content, media }: Props) {
  const showTitle = platform !== "instagram";

  return (
    <aside className="min-w-0">
      <SectionTitle>
        Live Preview
        <span className="ml-2 text-[10px] font-normal text-subtle">
          APPROXIMATE
        </span>
      </SectionTitle>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className=" flex items-center justify-between p-4">
          <PlatformBadge platform={platform} />

          <span className="text-[10px] text-subtle">PREVIEW</span>
        </div>

        <MediaThumb media={media} />

        <div className="space-y-4 p-5">
          {showTitle && (
            <h3 className="wrap-break-word font-display text-lg font-semibold">
              {content.title.trim() ||
                (platform === "youtube"
                  ? "Your video title"
                  : "Your video hook")}
            </h3>
          )}

          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-muted-foreground">
            {content.body.trim() ||
              (platform === "youtube"
                ? "Your video description will appear here."
                : "Your caption will appear here.")}
          </p>

          {content.tags.trim() && (
            <p className="wrap-break-word text-xs text-brand-2">
              {content.tags}
            </p>
          )}

          {platform === "instagram" && content.cta.trim() && (
            <p className="text-sm font-semibold">{content.cta}</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-subtle">
        Preview for {PLATFORMS[platform].label}. Actual platform layouts may
        vary.
      </p>
    </aside>
  );
}

export default PlatformContentPreview;
