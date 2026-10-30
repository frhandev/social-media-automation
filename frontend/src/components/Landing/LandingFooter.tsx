import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import logo from "../../../public/branding/socialflow-full-logo.png";

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Platforms", href: "#platforms" },
  { label: "Dashboard preview", href: "#preview" },
] as const;

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div className="max-w-md">
            <Link
              href="/"
              aria-label="SocialFlow AI homepage"
              className="inline-flex items-center"
            >
              <Image src={logo} alt="SocialFlow AI" className="h-auto w-43" />
            </Link>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              A smarter space for planning, organizing, and exploring
              multi-platform social content.
            </p>

            <p className="mt-4 text-xs leading-6 text-subtle">
              A graduation project exploring AI-assisted social media content
              management.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-10">
            <div>
              <h2 className="mb-5 text-xs font-bold uppercase tracking-widest">
                Explore
              </h2>

              <nav
                aria-label="Footer navigation"
                className="flex flex-col gap-3"
              >
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h2 className="mb-5 text-xs font-bold uppercase tracking-widest">
                Product
              </h2>

              <div className="flex flex-col items-start gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:text-brand-2"
                >
                  Interactive demo
                  <ArrowUpRight size={15} />
                </Link>

                <span className="text-sm text-subtle">
                  Authentication — soon
                </span>

                <span className="text-sm text-subtle">
                  Backend — in development
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© SocialFlow AI. Frontend demonstration.</p>

          <p>Built with Next.js · Designed for creators</p>
        </div>
      </div>
    </footer>
  );
}
