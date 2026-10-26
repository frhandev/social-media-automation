
import type { Platform } from "./Platform";
import type { SocialAccountStatus } from "./SocialAccountStatus";

export type PlatformAccount = {
  platform: Platform;
  account?: string;
  status: SocialAccountStatus;
};
