"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Page } from "@/components/shared";

import {
  analyticsDailyRecords,
  posts,
  publishingRecords,
} from "@/lib/mock-data";

import {
  aggregateAnalyticsOverview,
  buildEngagementSeries,
  buildPlatformComparison,
  buildViewsSeries,
  filterAnalyticsRecords,
  getTopPerformingPosts,
} from "@/lib/analytics";

import {
  INITIAL_ANALYTICS_FILTERS,
  type AnalyticsFiltersState,
} from "@/types/analytics/AnalyticsFiltersState";

import AnalyticsFilters from "./AnalyticsFilters";
import AnalyticsOverview from "./AnalyticsOverview";
import ViewsChart from "./ViewsChart";
import EngagementChart from "./EngagementChart";
import PlatformComparison from "./PlatformComparison";
import TopPerformingPosts from "./TopPerformingPosts";

type Props = {
  todayKey: string;
};

export default function AnalyticsPage({ todayKey }: Props) {
  const [filters, setFilters] = useState<AnalyticsFiltersState>({
    ...INITIAL_ANALYTICS_FILTERS,
  });

  const facts = useMemo(
    () =>
      filterAnalyticsRecords(
        analyticsDailyRecords,
        publishingRecords,
        posts,
        filters,
        todayKey,
      ),
    [filters, todayKey],
  );

  const overview = useMemo(() => aggregateAnalyticsOverview(facts), [facts]);

  const viewsSeries = useMemo(
    () => buildViewsSeries(facts, todayKey, filters.days),
    [facts, todayKey, filters.days],
  );

  const engagementSeries = useMemo(
    () => buildEngagementSeries(facts, todayKey, filters.days),
    [facts, todayKey, filters.days],
  );

  const comparison = useMemo(
    () => buildPlatformComparison(facts, filters.platform),
    [facts, filters.platform],
  );

  const topPosts = useMemo(() => getTopPerformingPosts(facts), [facts]);

  const hasData = facts.length > 0;

  return (
    <Page className="max-w-7xl space-y-8">
      <PageHeader
        eyebrow="Content intelligence"
        title="Analytics"
        description="Understand your content performance across YouTube, TikTok, and Instagram."
      />

      {/* Data transparency */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-5 py-4">
        <p className="text-xs leading-6 text-muted-foreground">
          <span className="mr-2 inline-block size-2 rounded-full bg-brand-2" />
          Illustrative mock analytics — not real social media performance data.
        </p>

        <p className="text-[11px] text-subtle">Europe/Istanbul</p>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        filters={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters({
            ...INITIAL_ANALYTICS_FILTERS,
          })
        }
      />

      {/* Overview KPIs */}
      <AnalyticsOverview data={overview} hasData={hasData} />

      {/* Time series */}
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <ViewsChart data={viewsSeries} hasData={hasData} />

        <EngagementChart data={engagementSeries} hasData={hasData} />
      </div>

      {/* Platform comparison */}
      <PlatformComparison data={comparison} hasData={hasData} />

      {/* Top content */}
      <TopPerformingPosts posts={topPosts} />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5 text-[11px] text-subtle">
        <span>
          {facts.length} daily analytics records in the selected period
        </span>

        <span>Successful platform publications only</span>
      </div>
    </Page>
  );
}
