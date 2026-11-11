"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  CalendarDays,
  Images,
  LayoutDashboard,
  LogOut,
  Send,
  Settings,
  Share2,
  SquarePen,
} from "lucide-react";

import logo from "../../../public/branding/socialflow-full-logo.png";

import { cn } from "@/lib/utils";
import { user, workspace } from "@/lib/mock-data";

const nav = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Media", to: "/media", icon: Images },
  { label: "Posts", to: "/posts", icon: SquarePen },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Social Accounts", to: "/social-accounts", icon: Share2 },
  { label: "Publishing", to: "/publishing", icon: Send },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
] as const;

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex h-16 items-center border-b border-sidebar-border px-5"
      >
        <Image src={logo} alt="SocialFlow AI" priority />
      </Link>

      {/* Read-only workspace */}
      <div className="border-b border-sidebar-border px-4 py-4">
        <p className="eyebrow mb-2">Workspace</p>

        <div className="rounded-md border border-border bg-card px-3 py-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2 rounded-full bg-brand ring-1 ring-ink" />
            <span className="min-w-0 truncate">{workspace.name}</span>
          </p>

          <p className="mt-2 text-[11px] leading-5 text-subtle">
            Demo workspace · Switching unavailable
          </p>
        </div>
      </div>

      <nav
        aria-label="Application navigation"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul className="space-y-1">
          {nav.map((link) => {
            const active = isActiveRoute(pathname, link.to);

            const Icon = link.icon;

            return (
              <li key={link.to}>
                <Link
                  href={link.to}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-ink bg-brand text-ink shadow-brutal-xs"
                      : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/settings"
          onClick={onNavigate}
          aria-current={
            isActiveRoute(pathname, "/settings") ? "page" : undefined
          }
          className={cn(
            "flex items-center gap-3 rounded-md border-2 px-3 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring",
            isActiveRoute(pathname, "/settings")
              ? "border-ink bg-brand text-ink shadow-brutal-xs"
              : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <Settings className="size-4" aria-hidden="true" />
          Settings
        </Link>

        <div className="mt-3 flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ink font-display text-xs font-bold text-ink-foreground">
            {user.initials}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {user.fullName}
            </span>
            <span className="block truncate text-xs text-subtle">
              {user.email}
            </span>
          </span>

          <Link
            href="/"
            onClick={onNavigate}
            aria-label="Exit demo"
            title="Exit demo"
            className="rounded-md p-1.5 text-subtle hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-62.5 shrink-0 border-r border-sidebar-border lg:block">
      <div className="fixed inset-y-0 left-0 w-62.5 border-r border-sidebar-border">
        <SidebarNav />
      </div>
    </aside>
  );
}
