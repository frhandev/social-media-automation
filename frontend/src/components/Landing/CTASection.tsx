import Link from "next/link";

import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section
      id="explore"
      aria-labelledby="cta-title"
      className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-ink px-6 py-14 shadow-brutal sm:px-10 sm:py-18 lg:px-16 lg:py-20">
          {/* Decorative elements */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-30 size-80 rotate-12 border-35 border-brand/25 sm:size-110"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-30 -right-15 size-70 rounded-full border-28 border-brand-2/35"
          />

          <div className="relative z-10 max-w-3xl">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              YOUR NEXT WORKFLOW STARTS HERE
            </p>

            <h2
              id="cta-title"
              className="font-display text-4xl font-bold uppercase leading-[0.99] tracking-tight text-ink-foreground sm:text-6xl"
            >
              Ready to see
              <br />
              it in action?
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-ink-foreground/75">
              Explore SocialFlow AI&apos;s interactive frontend demo and
              discover a more organized way to plan and manage social content.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
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

              <Link
                href="#features"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-ink-foreground transition-colors hover:text-brand"
              >
                Explore features
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 flex items-start gap-2 text-xs leading-6 text-ink-foreground/65">
              <CheckCircle2 size={16} className="mt-1 shrink-0 text-brand" />

              <p>
                No login required for the frontend demo. Real publishing and
                account integration will be added in later development phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
