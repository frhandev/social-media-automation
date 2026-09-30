"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";

import { SidebarNav } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { user } from "@/lib/mock-data";
import { usePathname } from "next/navigation";
import Link from "next/link";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/posts/new": "Create post",
  "/media": "Media",
  "/posts": "Posts",
  "/calendar": "Calendar",
  "/social-accounts": "Social Accounts",
  "/publishing": "Publishing",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const section = TITLES[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="iconSm"
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav  />
        </SheetContent>
      </Sheet>

      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-2 text-sm"
      >
        <span className="hidden text-subtle sm:inline">SocialFlow</span>
        <span className="hidden text-subtle sm:inline">/</span>
        <span className="truncate font-medium">{section}</span>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-subtle transition-colors hover:bg-secondary md:flex">
          <Search className="size-3.5" />
          <span>Search or run a command</span>
          <kbd className="ml-6 rounded border border-border bg-secondary px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
        <Button
          variant="outline"
          size="iconSm"
          className="md:hidden"
          aria-label="Search"
        >
          <Search />
        </Button>
        <Button
          variant="outline"
          size="iconSm"
          className="relative"
          aria-label="Notifications"
        >
          <Bell />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
        <Link
          href="/settings"
          aria-label="Your profile"
          className="flex size-8 items-center justify-center rounded-md border-2 border-ink bg-brand font-display text-xs font-bold text-ink"
        >
          {user.initials}
        </Link>
      </div>
    </header>
  );
}
