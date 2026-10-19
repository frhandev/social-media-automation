import { CalendarClock, Check, CheckCircle2, Clock3, Info } from "lucide-react";

import { PlatformBadge } from "@/components/layout/PlatformBadge";
import { Field, MediaThumb, SectionTitle } from "@/components/shared";

import { mediaItems } from "@/lib/mock-data";
import { formatDate } from "@/lib/helperFunctions";
import { PUBLISHING_TIME_ZONE, validateSchedule } from "@/lib/scheduling";
import { cn } from "@/lib/utils";

import type { Platform } from "@/types/platform/Platform";
import { PublishingMode } from "@/types/post/PublishingMode";

type Props = {
  mode: PublishingMode;
  onModeChange: (mode: PublishingMode) => void;

  scheduledDate: string;
  onDateChange: (value: string) => void;

  scheduledTime: string;
  onTimeChange: (value: string) => void;

  mediaId: string;
  platforms: Platform[];
};

export default function PublishingStep({
  mode,
  onModeChange,
  scheduledDate,
  onDateChange,
  scheduledTime,
  onTimeChange,
  mediaId,
  platforms,
}: Props) {
  const media = mediaItems.find((item) => item.id === mediaId);

  const schedule =
    mode === "schedule" ? validateSchedule(scheduledDate, scheduledTime) : null;

  const isReady = mode === "now" || schedule?.valid === true;

  const scheduledAt = mode === "schedule" ? schedule?.scheduledAt : null;

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle>Choose when to publish</SectionTitle>

        <p className="text-sm text-muted-foreground">
          Select how your content should be published. This is a frontend-only
          preview.
        </p>
      </div>

      <div className="editor-layout">
        <section className="min-w-0 space-y-6">
          {/* Publishing mode */}
          <div
            role="group"
            aria-label="Publishing mode"
            className="grid gap-4 sm:grid-cols-2"
          >
            <button
              type="button"
              aria-pressed={mode === "now"}
              onClick={() => onModeChange("now")}
              className={cn(
                "choice flex min-h-48 flex-col items-start",
                mode === "now" && "selected",
              )}
            >
              <Clock3 size={25} strokeWidth={1.5} />

              <span className="choice-check" aria-hidden="true">
                {mode === "now" && <Check size={13} />}
              </span>

              <h3 className="mt-6 font-display text-lg font-bold">
                PUBLISH NOW
              </h3>

              <p className="mt-2 text-left text-xs leading-6 text-muted-foreground">
                Publish as soon as the backend is connected and publishing is
                enabled.
              </p>
            </button>

            <button
              type="button"
              aria-pressed={mode === "schedule"}
              onClick={() => onModeChange("schedule")}
              className={cn(
                "choice flex min-h-48 flex-col items-start",
                mode === "schedule" && "selected",
              )}
            >
              <CalendarClock size={25} strokeWidth={1.5} />

              <span className="choice-check" aria-hidden="true">
                {mode === "schedule" && <Check size={13} />}
              </span>

              <h3 className="mt-6 font-display text-lg font-bold">SCHEDULE</h3>

              <p className="mt-2 text-left text-xs leading-6 text-muted-foreground">
                Choose a future date and time for publication.
              </p>
            </button>
          </div>

          {/* Schedule form */}
          {mode === "schedule" && (
            <div className="panel space-y-5">
              <div>
                <h3 className="font-display text-lg font-bold">
                  Schedule your post
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Set a future publishing time.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Publication date" error={schedule?.errors.date}>
                  <input
                    type="date"
                    className="form-control"
                    value={scheduledDate}
                    onChange={(event) => onDateChange(event.target.value)}
                    aria-invalid={!!schedule?.errors.date}
                    required
                  />
                </Field>

                <Field label="Publication time" error={schedule?.errors.time}>
                  <input
                    type="time"
                    className="form-control"
                    value={scheduledTime}
                    onChange={(event) => onTimeChange(event.target.value)}
                    aria-invalid={!!schedule?.errors.time}
                    required
                  />
                </Field>
              </div>

              <div className="flex items-start gap-2 rounded-md bg-secondary p-4">
                <Clock3 size={16} className="mt-0.5 shrink-0" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold">
                    {PUBLISHING_TIME_ZONE}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    The selected date and time are interpreted in Istanbul time,
                    regardless of your device timezone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation status */}
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "rounded-lg border p-4",
              isReady
                ? "border-success/40 bg-card"
                : "border-border bg-secondary",
            )}
          >
            <div className="flex items-start gap-3">
              {isReady ? (
                <CheckCircle2 size={19} className="shrink-0 text-success" />
              ) : (
                <Info size={19} className="shrink-0 text-muted-foreground" />
              )}

              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {isReady
                    ? "Ready for backend integration"
                    : "Schedule needs attention"}
                </p>

                <p className="text-xs leading-6 text-muted-foreground">
                  {isReady
                    ? "Your publishing options are configured. No post will be published or saved in this demo."
                    : "Choose a valid future date and time to complete the scheduling setup."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final summary */}
        <aside className="min-w-0 self-start">
          <section className="panel space-y-5">
            <p className="eyebrow">YOUR POST, AT A GLANCE</p>

            <div className="overflow-hidden rounded-lg border border-border">
              <MediaThumb media={media} />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold break-all">
                {media?.filename || "No media selected"}
              </p>

              <p className="text-xs text-subtle">
                {media
                  ? `${media.type} · ${media.format}`
                  : "Media unavailable"}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="eyebrow mb-3">SELECTED PLATFORMS</p>

              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <PlatformBadge key={platform} platform={platform} />
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="eyebrow mb-3">PUBLISHING METHOD</p>

              <p className="text-sm font-semibold">
                {mode === "now" ? "Publish now" : "Scheduled publishing"}
              </p>

              {mode === "schedule" && (
                <div className="mt-3 space-y-2">
                  {scheduledAt ? (
                    <>
                      <p className="font-display text-lg font-bold">
                        {formatDate(scheduledAt, true, true)}
                      </p>

                      <p className="text-xs text-subtle">
                        {PUBLISHING_TIME_ZONE}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No valid future time selected.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs leading-6 text-muted-foreground">
                Nothing will be published or scheduled in this task.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
