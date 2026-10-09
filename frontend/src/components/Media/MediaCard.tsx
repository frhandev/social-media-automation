import { cn } from "@/lib/utils";
import Media from "@/types/media/Media";
import { MediaThumb, sizeLabel } from "../shared";
import { ArrowUpRight, Check } from "lucide-react";
import { StatusBadge } from "../layout/StatusBadge";
import { formatDate } from "@/lib/helperFunctions";

function MediaCard({
  media,
  selected,
  onClick,
  selectable = false,
}: {
  media: Media;
  selected?: boolean;
  onClick: () => void;
  selectable?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={selectable && media.status !== "ready"}
      aria-pressed={selectable ? !!selected : undefined}
      className={cn("media-card text-left", selected && "is-selected")}
    >
      <div className="relative">
        <MediaThumb media={media} />
        <span className={cn("media-select", selected && "bg-brand")}>
          {selected ? <Check size={15} /> : <ArrowUpRight size={15} />}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold">{media.filename}</h3>
        </div>
        <p className="mb-3 mt-1 text-xs text-subtle">
          {media.width ? `${media.width} × ${media.height}` : media.format}{" "}
          <span className="px-1">·</span> {sizeLabel(media.sizeBytes)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusBadge status={media.status} />
          <span className="text-[11px] text-subtle">
            {formatDate(media.uploadedAt)}
          </span>
        </div>
        {media.status === "uploading" && (
          <div className="mt-3">
            <div className="mb-1 text-xs">{media.progress}%</div>
            <progress
              className="w-full accent-brand"
              max={100}
              value={media.progress}
            />
          </div>
        )}
      </div>
    </button>
  );
}

export default MediaCard;