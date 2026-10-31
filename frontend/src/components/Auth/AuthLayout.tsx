import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, ArrowUpRight, Layers3 } from "lucide-react";

import logo from "../../../public/branding/socialflow-full-logo.png";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Editorial panel — desktop */}
      <aside className="relative hidden min-h-dvh flex-col justify-between overflow-hidden border-r border-border bg-secondary/60 p-10 lg:flex xl:p-14">
        <Link
          href="/"
          aria-label="SocialFlow AI homepage"
          className="relative z-10 inline-flex w-fit items-center"
        >
          <Image
            src={logo}
            alt="SocialFlow AI"
            priority
            className="h-auto w-44"
          />
        </Link>

        <div className="relative z-10 max-w-xl py-16">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <span className="size-2 rounded-full bg-brand-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              One creative workspace
            </span>
          </div>

          <p className="font-display text-[clamp(3rem,5vw,5.5rem)] font-bold uppercase leading-[0.96] tracking-[-0.06em]">
            Your content.
            <span className="mt-3 block">One creative</span>
            <span className="mt-4 inline-block -rotate-1 border-2 border-ink bg-brand px-4 py-2 text-ink shadow-brutal">
              workspace.
            </span>
          </p>

          <p className="mt-9 max-w-md text-base leading-8 text-muted-foreground">
            Organize, plan, and explore your social media content workflow
            across multiple platforms from one place.
          </p>

          <div className="mt-9 flex flex-wrap gap-2">
            {["YouTube", "TikTok", "Instagram"].map((platform) => (
              <span
                key={platform}
                className="rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-25 -right-25 size-80 rotate-12 rounded-full border-35 border-brand/70"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-14 top-30 size-12 rounded-full bg-brand-2"
        />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold">
            <Layers3 size={16} aria-hidden="true" />
            SocialFlow AI
          </span>

          <span className="text-[11px] text-muted-foreground">
            Graduation project · Frontend demo
          </span>
        </div>
      </aside>

      {/* Shared form area */}
      <div className="flex min-h-dvh min-w-0 flex-col bg-card px-5 py-6 sm:px-10 lg:px-12 lg:py-9">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="SocialFlow AI homepage"
            className="inline-flex lg:hidden"
          >
            <Image
              src={logo}
              alt="SocialFlow AI"
              priority
              className="h-auto w-35"
            />
          </Link>

          <Link
            href="/"
            className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to website
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center py-10 sm:py-12">
          <div className="w-full max-w-md">{children}</div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="text-[11px] text-muted-foreground">
            Authentication UI preview
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-2 hover:underline"
          >
            Explore demo
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </div>
  );
}
