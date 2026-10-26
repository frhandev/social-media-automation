
import type { PlatformAccount } from "@/types/platform/PlatformAccount";

type AccountConnection = Pick<PlatformAccount, "status">;

export function isAccountConnected(
  account: AccountConnection | undefined,
): boolean {
  return account?.status === "connected";
}

export function needsAccountAttention(
  account: AccountConnection,
): boolean {
  return !isAccountConnected(account);
}
