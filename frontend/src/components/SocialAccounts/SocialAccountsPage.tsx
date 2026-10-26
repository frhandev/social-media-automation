"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState, Page } from "@/components/shared";

import { platformAccounts } from "@/lib/mock-data";
import {
  isAccountConnected,
  needsAccountAttention,
} from "@/lib/social-accounts";

import SocialAccountCard from "./SocialAccountCard";
import SocialAccountsFilters from "./SocialAccountsFilters";
import { SocialAccountsFilter } from "@/types/platform/SocialAccountsFilter";

export default function SocialAccountsPage() {
  const [filter, setFilter] = useState<SocialAccountsFilter>("all");

  const total = platformAccounts.length;

  const connectedCount = platformAccounts.filter(isAccountConnected).length;

  const attentionCount = platformAccounts.filter(needsAccountAttention).length;

  const filteredAccounts = platformAccounts.filter((account) => {
    if (filter === "connected") {
      return isAccountConnected(account);
    }

    if (filter === "attention") {
      return needsAccountAttention(account);
    }

    return true;
  });

  return (
    <Page>
      <PageHeader
        eyebrow="Workspace integrations"
        title="Social accounts"
        description="Manage where your content goes. Review connected channels and accounts that need attention."
      />

      {/* Account overview */}
      <section
        aria-label="Social accounts overview"
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-6">
          <div>
            <p className="eyebrow mb-3">CONNECTED ACCOUNTS</p>

            <p className="font-display text-5xl font-bold tabular-nums">
              {connectedCount}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Out of {total} supported platforms
            </p>
          </div>

          <div className="flex size-13 shrink-0 items-center justify-center rounded-lg bg-brand">
            <CheckCircle2 size={24} className="text-ink" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-6">
          <div>
            <p className="eyebrow mb-3">NEEDS ATTENTION</p>

            <p className="font-display text-5xl font-bold tabular-nums">
              {attentionCount}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Not connected, expired, or error
            </p>
          </div>

          <div className="flex size-13 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <ShieldAlert size={24} className="text-foreground" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="space-y-5">
        <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="editorial text-xl">Your channels</h2>

            <p className="mt-2 text-xs text-muted-foreground">
              {filteredAccounts.length} of {total} accounts
            </p>
          </div>

          <SocialAccountsFilters value={filter} onChange={setFilter} />
        </div>

        {filteredAccounts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredAccounts.map((account) => (
              <SocialAccountCard key={account.platform} account={account} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching accounts"
            description={
              filter === "connected"
                ? "There are no connected accounts in this workspace."
                : filter === "attention"
                  ? "All configured accounts are connected."
                  : "There are no social accounts to display."
            }
          />
        )}
      </section>

      {/* Frontend/backend boundary */}
      <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-5">
        <p className="text-sm font-semibold">
          Connection management is coming later.
        </p>

        <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground">
          Account statuses are mock data in this frontend preview. Connecting,
          reconnecting, and disconnecting accounts will be available after
          ASP.NET Core OAuth integration. No external accounts are modified
          here.
        </p>
      </div>
    </Page>
  );
}
