"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { SidebarNav } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { user } from "@/lib/mock-data";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/media": "Media",
  "/posts": "Posts",
  "/calendar": "Calendar",
  "/social-accounts": "Social Accounts",
  "/publishing": "Publishing",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (pathname === "/posts/new") {
    return "Create post";
  }

  if (pathname.startsWith("/posts/")) {
    return "Post details";
  }

  return TITLES[pathname] ?? "Workspace";
}

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const section = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="iconSm"
            className="lg:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
          >
            <Menu aria-hidden="true" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-70 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          <SidebarNav onNavigate={() => setOpen(false)} />
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
        <Link
          href="/settings"
          aria-label="Your profile settings"
          className="flex size-8 items-center justify-center rounded-md border-2 border-ink bg-brand font-display text-xs font-bold text-ink focus-visible:ring-2 focus-visible:ring-ring"
        >
          {user.initials}
        </Link>
      </div>
    </header>
  );
}
