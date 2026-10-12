import { PlatformBadge, PLATFORMS } from "@/components/layout/PlatformBadge";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { SectionTitle } from "@/components/shared";
import { platformAccounts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Platform } from "@/types/platform/Platform";
import { Check } from "lucide-react";

type Props = {
  platforms: Platform[];
  onToggle: (platform: Platform) => void;
};

function PlatformSelectionStep({ platforms, onToggle }: Props) {
  return (
    <section>
      <SectionTitle> Where should this go?</SectionTitle>

      <p className="mb-6 text-sm text-muted-foreground">
        Select the connected channels for your post.
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        {platformAccounts.map((account) => {
          const selected = platforms.includes(account.platform);

          return (
            <button
              key={account.platform}
              type="button"
              disabled={!account.connected}
              aria-pressed={selected}
              onClick={() => onToggle(account.platform)}
              className={cn(
                "choice",
                selected && "selected",
                !account.connected && "cursor-not-allowed opacity-60",
              )}
            >
              <div className="mb-4">
                <PlatformBadge platform={account.platform} />
              </div>

              <h3 className="mb-2 font-display text-xl font-bold">
                {PLATFORMS[account.platform].label}
              </h3>

              <p className="mb-5 text-xs text-subtle">
                {account.account || "No account linked"}
              </p>

              <StatusBadge
                status={account.connected ? "connected" : "not_connected"}
              />

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

export default PlatformSelectionStep;
