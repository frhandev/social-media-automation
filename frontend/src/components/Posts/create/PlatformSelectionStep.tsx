import { Check } from "lucide-react";

import { PlatformBadge, PLATFORMS } from "@/components/layout/PlatformBadge";

import SocialAccountStatus from "@/components/SocialAccounts/SocialAccountStatus";

import { SectionTitle } from "@/components/shared";

import { platformAccounts } from "@/lib/mock-data";
import { isAccountConnected } from "@/lib/social-accounts";
import { cn } from "@/lib/utils";

import type { Platform } from "@/types/platform/Platform";
import type { SocialAccountStatus as AccountStatus } from "@/types/platform/SocialAccountStatus";

type Props = {
  platforms: Platform[];
  onToggle: (platform: Platform) => void;
};

const STATUS_HINTS: Record<AccountStatus, string> = {
  connected: "",
  not_connected: "Account not connected",
  expired: "Connection expired — reconnect required",
  error: "Connection error — attention required",
};

export default function PlatformSelectionStep({ platforms, onToggle }: Props) {
  return (
    <section>
      <SectionTitle>Where should this go?</SectionTitle>

      <p className="mb-6 text-sm text-muted-foreground">
        Select the connected channels for your post.
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        {platformAccounts.map((account) => {
          const connected = isAccountConnected(account);
          const selected = platforms.includes(account.platform);

          return (
            <button
              key={account.platform}
              type="button"
              disabled={!connected}
              aria-pressed={selected}
              onClick={() => onToggle(account.platform)}
              className={cn(
                "choice min-w-0",
                selected && "selected",
                !connected && "cursor-not-allowed opacity-60",
              )}
            >
              <div className="mb-4">
                <PlatformBadge platform={account.platform} />
              </div>

              <h3 className="mb-2 font-display text-xl font-bold">
                {PLATFORMS[account.platform].label}
              </h3>

              <p className="mb-5 wrap-break-word text-xs text-subtle">
                {account.account || "No account linked"}
              </p>

              <div>
                <SocialAccountStatus status={account.status} />
              </div>

              {!connected && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {STATUS_HINTS[account.status]}
                </p>
              )}

              <span className="choice-check" aria-hidden="true">
                {selected && <Check size={13} />}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
