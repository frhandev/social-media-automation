import { Platform } from "./Platform";

export type PlatformAccount = {
  platform: Platform;
  account?: string | undefined;
  connected: boolean;
};