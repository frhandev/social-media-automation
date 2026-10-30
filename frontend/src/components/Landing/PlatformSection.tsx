import { ArrowUpRight, Check, Link2Off } from "lucide-react";

import { PLATFORMS } from "@/components/layout/PlatformBadge";

import type { Platform } from "@/types/platform/Platform";

const CHANNELS: {
  platform: Platform;
  tagline: string;
  description: string;
  format: string;
}[] = [
  {
    platform: "youtube",
    tagline: "Tell the bigger story.",
    description:
      "Prepare video titles, detailed descriptions, and tags for longer-form content.",
    format: "Title · Description · Tags",
  },
  {
    platform: "tiktok",
    tagline: "Make the first second count.",
    description:
      "Craft short-form hooks, captions, and hashtags designed for a fast-moving feed.",
    format: "Hook · Caption · Hashtags",
  },
  {
    platform: "instagram",
    tagline: "Make every post count.",
    description:
      "Customize captions, hashtags, and calls to action for visual-first content.",
    format: "Caption · Hashtags · CTA",
  },
];

export default function PlatformSection() {
  return (
    <section
      id="platforms"
      aria-labelledby="platforms-title"
      className="scroll-mt-24 border-b border-border px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="eyebrow mb-3">MADE FOR EVERY CHANNEL</p>

          <h2
            id="platforms-title"
            className="max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl"
          >
            One workspace.
            <br />
            Three different voices.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            Every platform has its own content format. SocialFlow AI gives each
            channel its own space in the creation workflow.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map((channel, index) => {
            const platform = PLATFORMS[channel.platform];
            const Icon = platform.icon;

            return (
              <article
                key={channel.platform}
                className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-ink sm:p-7"
              >
                <div className="mb-8 flex items-center justify-between gap-3">
                  <div
                    className={`flex size-14 items-center justify-center rounded-xl border ${
                      index === 1
                        ? "border-ink bg-brand"
                        : "border-border bg-secondary"
                    }`}
                  >
                    <Icon className="size-7" aria-hidden="true" />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-subtle"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="font-display text-2xl font-bold">
                  {platform.label}
                </h3>

                <p className="mt-2 text-sm font-semibold text-brand-2">
                  {channel.tagline}
                </p>

                <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                  {channel.description}
                </p>

                <div className="mt-7 border-t border-border pt-5">
                  <div className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-success" />

                    <p className="text-xs font-semibold">{channel.format}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 flex items-start gap-3 text-xs leading-6 text-muted-foreground">
          <Link2Off size={17} className="mt-0.5 shrink-0 text-brand-2" />

          <p>
            YouTube, TikTok, and Instagram are supported by the frontend content
            workflow. Live OAuth connections and real publishing are not enabled
            in this demo.
          </p>
        </div>
      </div>
    </section>
  );
}
