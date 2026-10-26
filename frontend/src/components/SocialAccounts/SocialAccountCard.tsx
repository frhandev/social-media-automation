import { PlatformAccount } from "@/types/platform/PlatformAccount";
import type { SocialAccountStatus as AccountStatus } from "@/types/platform/SocialAccountStatus";
import { PlatformBadge, PLATFORMS } from "../layout/PlatformBadge";
import SocialAccountStatus from "./SocialAccountStatus";
import { ArrowUpRight, Link2, ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  account: PlatformAccount;
};

const STATUS_DESCRIPTION: Record<AccountStatus, string> = {
  connected: "This account is marked as connected in the demo workspace.",
  not_connected: "No account is currently linked to this platform.",
  expired: "The demo connection has expired. Reauthorization will be required.",
  error: "The demo connection has an issue that needs attention.",
};

const ACTION_LABEL: Record<AccountStatus, string> = {
  connected: "Disconnect",
  not_connected: "Connect",
  expired: "Reconnect",
  error: "Reconnect",
};

function SocialAccountCard({ account }: Props) {
  const platformName = PLATFORMS[account.platform].label;

  const displayAccount = account.account?.trim() || "No account linked";

  const needsAttention = account.status !== "connected";

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-ink/40">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border p-5">
        <div className="flex min-w-0 flex-col gap-3">
          <p className="eyebrow">SOCIAL INTEGRATION</p>

          <PlatformBadge platform={account.platform} />
        </div>

        <SocialAccountStatus status={account.status} />
      </div>

      {/* Account details */}
      <div className="flex-1 space-y-5 p-5">
        <div>
          <h2 className="font-display text-2xl font-bold">{platformName}</h2>

          <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-subtle">
            {account.platform === "youtube" ? "Channel" : "Account"}
          </p>

          <p className="mt-2 wrap-break-word text-sm font-semibold">
            {displayAccount}
          </p>
        </div>

        <p className="min-h-12 text-xs leading-6 text-muted-foreground">
          {STATUS_DESCRIPTION[account.status]}
        </p>

        {needsAttention && (
          <div className="flex items-start gap-2 rounded-md border border-border bg-secondary/50 p-3">
            <ShieldAlert
              size={16}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              This account cannot be selected for publishing until its
              connection is restored.
            </p>
          </div>
        )}
      </div>

      {/* Future action */}
      <footer className="border-t border-border bg-secondary/30 p-5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          disabled
          title="Available after ASP.NET Core OAuth integration"
        >
          <Link2 size={15} />
          {ACTION_LABEL[account.status]}
          <ArrowUpRight size={14} />
        </Button>

        <p className="mt-3 text-center text-[11px] leading-5 text-subtle">
          Available after backend integration
        </p>
      </footer>
    </article>
  );
}

export default SocialAccountCard;
