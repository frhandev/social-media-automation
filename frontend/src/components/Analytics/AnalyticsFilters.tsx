"use client";

import { RotateCcw } from "lucide-react";

import { Select } from "@/components/shared";
import { Button } from "@/components/ui/button";

import type {
  AnalyticsDateRange,
  AnalyticsFiltersState,
} from "@/types/analytics/AnalyticsFiltersState";
import type { Platform } from "@/types/platform/Platform";

type Props = {
  filters: AnalyticsFiltersState;
  onChange: (filters: AnalyticsFiltersState) => void;
  onReset: () => void;
};

function AnalyticsFilters({ filters, onChange, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="mr-auto">
        <p className="eyebrow">PERFORMANCE EXPLORER</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Filter your performance data.
        </p>
      </div>

      <div className="min-w-40">
        <Select
          label="Filter analytics by platform"
          value={filters.platform}
          onChange={(value) =>
            onChange({
              ...filters,
              platform: value as Platform | "all",
            })
          }
          options={[
            {
              value: "all",
              label: "All platforms",
            },
            {
              value: "youtube",
              label: "YouTube",
            },
            {
              value: "tiktok",
              label: "TikTok",
            },
            {
              value: "instagram",
              label: "Instagram",
            },
          ]}
        />
      </div>

      <div className="min-w-40">
        <Select
          label="Select analytics date range"
          value={String(filters.days)}
          onChange={(value) =>
            onChange({
              ...filters,
              days: Number(value) as AnalyticsDateRange,
            })
          }
          options={[
            { value: "7", label: "Last 7 days" },
            { value: "30", label: "Last 30 days" },
            { value: "90", label: "Last 90 days" },
          ]}
        />
      </div>

      <Button type="button" variant="outline" size="sm" onClick={onReset}>
        <RotateCcw size={14} />
        Reset
      </Button>
    </div>
  );
}

export default AnalyticsFilters;
