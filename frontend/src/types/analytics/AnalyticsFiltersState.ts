import type { Platform } from "@/types/platform/Platform";

export type AnalyticsDateRange = 7 | 30 | 90;

export type AnalyticsFiltersState = {
  platform: Platform | "all";
  days: AnalyticsDateRange;
};

export const INITIAL_ANALYTICS_FILTERS: AnalyticsFiltersState = {
  platform: "all",
  days: 30,
};
