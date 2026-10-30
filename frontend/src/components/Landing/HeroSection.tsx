import Link from "next/link";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers3,
  Play,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/layout/PlatformBadge";

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-18 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-12 lg:px-10 lg:py-30">
        {/* Editorial copy */}
        <div className="relative z-10 min-w-0">
          <div className="mb-8 inline-flex flex-wrap items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-2">
            <span className="size-2 rounded-full bg-brand-2" />

            <span className="text-[10px] font-bold uppercase tracking-[0.13em]">
              Social media, one workspace
            </span>
          </div>

          <h1 className="max-w-4xl font-display text-[clamp(3.1rem,6.6vw,6.2rem)] font-bold uppercase leading-[0.94] tracking-[-0.065em]">
            One idea.
            <span className="mt-2 block">Every channel.</span>
            <span className="mt-4 inline-block -rotate-1 border-2 border-ink bg-brand px-3 py-2 text-ink shadow-brutal sm:px-5">
              Total control.
            </span>
          </h1>

          <p className="mt-9 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Plan, organize, and manage your content across YouTube, TikTok, and
            Instagram from a single creative workspace.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              variant="brutal"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/dashboard">
                Explore interactive demo
                <ArrowUpRight size={18} />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="#how-it-works">
                How it works
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex items-start gap-2 text-xs leading-6 text-muted-foreground">
            <Check size={16} className="mt-1 shrink-0 text-success" />

            <p>
              Explore the frontend without signing in. Publishing, AI
              assistance, and live platform integrations require future backend
              development.
            </p>
          </div>
        </div>

        {/* Illustrative creative workspace */}
        <div
          aria-label="Illustrative content planning preview"
          className="relative min-w-0"
        >
          <div
            aria-hidden="true"
            className="absolute -right-4 -top-5 h-full w-full rotate-3 rounded-2xl border-2 border-ink bg-brand sm:-right-6"
          />

          <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-card shadow-brutal">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-md bg-ink text-ink-foreground">
                  <Layers3 size={16} />
                </span>

                <span className="font-display text-sm font-bold">
                  Content workspace
                </span>
              </div>

              <span className="rounded border border-border bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                Demo
              </span>
            </div>

            {/* Sample creative asset */}
            <div className="p-5 sm:p-6">
              <div className="relative flex aspect-5/3 items-center justify-center overflow-hidden rounded-lg bg-ink">
                <div
                  aria-hidden="true"
                  className="absolute -left-9 bottom-0 size-42 rotate-20 rounded-3xl bg-brand-2 sm:size-54"
                />

                <div
                  aria-hidden="true"
                  className="absolute -right-7 -top-13 size-45 rotate-45 border-16 border-brand sm:size-58"
                />

                <div className="relative z-10 max-w-62 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                    Content idea / 001
                  </p>

                  <p className="mt-3 font-display text-2xl font-bold uppercase leading-[0.95] tracking-tight text-ink-foreground sm:text-4xl">
                    Create.
                    <br />
                    Adapt.
                    <br />
                    Share.
                  </p>
                </div>

                <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full border border-ink-foreground/30 bg-ink-foreground text-ink">
                  <Play size={15} fill="currentColor" />
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">SAMPLE CONTENT</p>

                  <p className="mt-1 font-display text-base font-bold">
                    One creative idea
                  </p>
                </div>

                <span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium">
                  Draft preview
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-secondary/50 p-3">
                  <PlatformBadge platform="youtube" />

                  <p className="mt-3 text-xs font-semibold">
                    Explain the full story.
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Long-form content
                  </p>
                </div>

                <div className="rounded-md border border-border bg-secondary/50 p-3">
                  <PlatformBadge platform="tiktok" />

                  <p className="mt-3 text-xs font-semibold">
                    Hook them in seconds.
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Short-form content
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                <Sparkles size={15} className="text-brand-2" />

                <p className="text-[11px] text-muted-foreground">
                  Illustrative workflow · No content published
                </p>

                <ArrowDownRight size={17} className="ml-auto text-brand-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
