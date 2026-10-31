"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import logo from "../../../public/branding/socialflow-full-logo.png";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Platforms", href: "#platforms" },
] as const;

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          closeMenu();
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex h-19 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="SocialFlow AI homepage"
          className="flex min-w-0 shrink-0 items-center"
        >
          <Image
            src={logo}
            alt="SocialFlow AI"
            priority
            className="h-auto w-36 sm:w-43"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link href="/register">Get started</Link>
          </Button>

          <Button asChild variant="brutal" size="sm">
            <Link href="/dashboard">
              Explore demo
              <ArrowUpRight size={15} />
            </Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="landing-mobile-menu"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="flex size-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          {menuOpen ? (
            <X size={21} aria-hidden="true" />
          ) : (
            <Menu size={21} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav
          id="landing-mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background px-5 py-5 shadow-lg sm:px-8 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 grid gap-3 border-t border-border pt-5">
            <Button asChild variant="brutal" className="w-full">
              <Link href="/dashboard" onClick={closeMenu}>
                Explore demo
                <ArrowUpRight size={16} />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/login" onClick={closeMenu}>
                Sign in
              </Link>
            </Button>

            <Button asChild variant="secondary" className="w-full">
              <Link href="/register" onClick={closeMenu}>
                Get started
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
