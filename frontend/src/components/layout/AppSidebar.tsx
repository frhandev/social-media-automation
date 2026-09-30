"use client";

import {
  BarChart3,
  CalendarDays,
  ChevronsUpDown,
  Images,
  LayoutDashboard,
  LogOut,
  Send,
  Settings,
  Share2,
  SquarePen,
} from "lucide-react";

import logo from "../../../public/branding/socialflow-full-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { cn } from "@/lib/utils";
import { user, workspace } from "@/lib/mock-data";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Media", to: "/media", icon: Images },
  { label: "Posts", to: "/posts", icon: SquarePen },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Social Accounts", to: "/social-accounts", icon: Share2 },
  { label: "Publishing", to: "/publishing", icon: Send },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <Link href="/dashboard" className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Image
          src={logo}
          alt="SocialFlow AI"
          priority
        />
      </Link>

      <div className="border-b border-sidebar-border px-4 py-4">
        <p className="eyebrow mb-2">Workspace</p>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
            <span className="flex items-center gap-2 truncate">
              <span className="size-2 rounded-full bg-brand ring-1 ring-ink" />
              <span className="truncate">{workspace.name}</span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-subtle" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="eyebrow">
              Switch workspace
            </DropdownMenuLabel>
            <DropdownMenuItem className="font-medium">
              {workspace.name}
            </DropdownMenuItem>
            {workspace.others.map((w) => (
              <DropdownMenuItem key={w}>{w}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {nav.map((link) => {
            const active = pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  key={link.to}
                  href={link.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "border-2 border-ink bg-brand text-ink shadow-brutal-xs"
                      : "border-2 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <link.icon className="size-4" aria-hidden />
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
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "border-2 border-ink bg-brand text-ink shadow-brutal-xs"
              : "border-2 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <Settings className="size-4" aria-hidden />
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
            aria-label="Log out"
            className="rounded-md p-1.5 text-subtle transition-colors hover:bg-secondary hover:text-destructive"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-sidebar-border lg:block">
      <div className="fixed inset-y-0 left-0 w-[250px] border-r border-sidebar-border">
        <SidebarNav />
      </div>
    </aside>
  );
}
