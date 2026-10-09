import { Platform } from "./platform/Platform";

export type Channel = {
  platform: Platform;
  handle?: string;
  connected: boolean;
};