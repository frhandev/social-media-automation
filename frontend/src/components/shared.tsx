"use client";
import Image from "next/image";
import { type ReactNode, useId } from "react";
import {
  ArrowUpRight,
  FolderOpen,
  TriangleAlert,
  Play,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Media from "@/types/media/Media";

export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl space-y-8", className)}>
      {children}
    </div>
  );
}
export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
      <h2 className="editorial text-xl">{children}</h2>
      {action}
    </div>
  );
}
export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && (
        <small className="font-normal text-muted-foreground">{hint}</small>
      )}
      {error && <small className="text-destructive">{error}</small>}
    </label>
  );
}
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </div>
  );
}
export function Tabs({
  items,
  value,
  onChange,
  label = "View",
}: {
  items: string[];
  value: string;
  onChange: (s: string) => void;
  label?: string;
}) {
  return (
    <div className="tab-group" role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item}
          className={cn("tab", value === item && "selected")}
          aria-pressed={value === item}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function EmptyState({
  title = "Nothing here yet.",
  description,
  action,
}: {
  title?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <FolderOpen size={30} strokeWidth={1.3} />
      <h2 className="editorial text-2xl">{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="empty-state">
      <TriangleAlert className="text-destructive" />
      <h2 className="editorial text-2xl">Unable to load media.</h2>
      <p>Something interrupted the library. Give it another try.</p>
      <Button variant="outline" onClick={onRetry}>
        Try again <ArrowUpRight size={16} />
      </Button>
    </div>
  );
}
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-label="Loading"
      role="status"
      className={cn("animate-pulse rounded-lg bg-secondary", className)}
    />
  );
}
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg bg-card sm:max-w-xl">
        <DialogTitle className="editorial pr-6 text-2xl">{title}</DialogTitle>
        <DialogDescription>
          {description || "Manage your content in the demo workspace."}
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
export const sizeLabel = (bytes: number) =>
  bytes > 1e6
    ? `${(bytes / 1e6).toFixed(1)} MB`
    : `${Math.ceil(bytes / 1000)} KB`;
export const duration = (seconds?: number) =>
  seconds
    ? `${Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0")}:${Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0")}`
    : "—";
export function MediaThumb({
  media,
  compact = false,
  playback = false,
}: {
  media?: Media;
  compact?: boolean;
  playback?: boolean;
}) {
  if (!media)
    return (
      <div className="media-art art-sand">
        <ImageIcon size={28} />
      </div>
    );
  if (media.local && !media.preview)
    return (
      <div
        className={cn(
          "media-art flex-col gap-3 p-4 text-center",
          compact && "art-compact",
        )}
      >
        <ImageIcon size={compact ? 16 : 30} strokeWidth={1.3} />
        {!compact && (
          <p className="max-w-52 text-xs leading-5 text-muted-foreground">
            Preview ended with the upload session.
            <br />
            Upload the file again to preview it.
          </p>
        )}
      </div>
    );
  if (media.preview)
    return (
      <div className={cn("media-art", compact && "art-compact")}>
        {media.type === "image" ? (
          <Image
            unoptimized
            width={640}
            height={400}
            src={media.preview}
            alt={media.filename}
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            src={media.preview}
            className="h-full w-full object-cover"
            controls={playback}
            muted
            playsInline
          />
        )}
      </div>
    );
  const text: Record<string, string[]> = {
    ink: ["BUILD BETTER", "BACKENDS."],
    lime: ["MAKE IT", "STAND OUT."],
    indigo: ["IDEAS INTO", "IMPACT."],
    sand: ["A LOOK", "INSIDE."],
  };
  return (
    <div
      className={cn("media-art", `art-${media.tone}`, compact && "art-compact")}
      aria-label={media.filename}
      role="img"
    >
      <div className="art-grid" />
      <span className="art-label">
        FERHAN STUDIO / {media.type === "video" ? "FILM" : "DESIGN"}
      </span>
      <div className="art-title">
        {text[media.tone].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <span className="art-symbol">↗</span>
      <span className="art-footer">
        SOCIALFLOW ORIGINALS <span>{media.format}</span>
      </span>
      {media.type === "video" && !compact && (
        <span className="art-duration">
          <Play size={10} fill="currentColor" />
          {duration(media.durationSec)}
        </span>
      )}
    </div>
  );
}
export function MediaFacts({ media }: { media: Media }) {
  return (
    <dl className="facts">
      <div>
        <dt>File type</dt>
        <dd>
          {media.format} · {media.type}
        </dd>
      </div>
      <div>
        <dt>Resolution</dt>
        <dd>
          {media.width
            ? `${media.width} × ${media.height}`
            : "Reading metadata"}
        </dd>
      </div>
      <div>
        <dt>File size</dt>
        <dd>{sizeLabel(media.sizeBytes)}</dd>
      </div>
      {media.type === "video" && (
        <div>
          <dt>Duration</dt>
          <dd>{duration(media.durationSec)}</dd>
        </div>
      )}
    </dl>
  );
}
