"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import {
  CalendarClock,
  CheckCircle2,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState, Modal, Page } from "@/components/shared";
import { Button } from "@/components/ui/button";

import { posts, publishingRecords } from "@/lib/mock-data";

import {
  INITIAL_PUBLISHING_FILTERS,
  filterPublishingRecords,
  getPublishingStats,
  type PublishingFiltersState,
} from "@/lib/publishing";

import PublishingFilters from "./PublishingFilters";
import PublishingTable from "./PublishingTable";
import PublicationDetails from "./PublicationDetails";

type MetricCardProps = {
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  emphasis?: boolean;
};

function MetricCard({
  label,
  value,
  description,
  icon,
  emphasis = false,
}: MetricCardProps) {
  return (
    <div
      className={
        emphasis
          ? "flex min-w-0 items-start justify-between gap-3 rounded-lg border border-ink bg-brand p-5 sm:p-6"
          : "flex min-w-0 items-start justify-between gap-3 rounded-lg border border-border bg-card p-5 sm:p-6"
      }
    >
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest">
          {label}
        </p>

        <p className="mt-4 font-display text-4xl font-bold tabular-nums sm:text-5xl">
          {value}
        </p>

        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </div>

      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background/70"
        aria-hidden="true"
      >
        {icon}
      </span>
    </div>
  );
}

export default function PublishingPage() {
  const [filters, setFilters] = useState<PublishingFiltersState>(
    INITIAL_PUBLISHING_FILTERS,
  );

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const stats = getPublishingStats(publishingRecords);

  const rows = filterPublishingRecords(publishingRecords, posts, filters);

  const selectedRecord = publishingRecords.find(
    (record) => record.id === selectedRecordId,
  );

  const selectedPost = selectedRecord
    ? posts.find((post) => post.id === selectedRecord.postId)
    : undefined;

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.platform !== "all" ||
    filters.status !== "all" ||
    filters.date !== "";

  function clearFilters() {
    setFilters({ ...INITIAL_PUBLISHING_FILTERS });
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Publishing"
        title="Publishing history"
        description="Every channel. Every attempt. A clear picture of what went out."
      />

      {/* Dashboard metrics */}
      <section
        aria-label="Publishing overview"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard
          label="Scheduled"
          value={stats.scheduled}
          description="Awaiting publication"
          icon={<CalendarClock size={21} />}
        />

        <MetricCard
          label="In progress"
          value={stats.inProgress}
          description="Queued or publishing"
          icon={<LoaderCircle size={21} />}
        />

        <MetricCard
          label="Published"
          value={stats.published}
          description="Successful publications"
          icon={<CheckCircle2 size={21} />}
          emphasis
        />

        <MetricCard
          label="Failed"
          value={stats.failed}
          description="Publications needing attention"
          icon={<TriangleAlert size={21} />}
        />
      </section>

      {/* Demo activity notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-5 py-4">
        <p className="text-xs leading-6 text-muted-foreground">
          <span className="mr-2 inline-block size-2 rounded-full bg-brand-2" />
          Demo publishing records. No publication or retry is executed here.
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            setFilters({
              ...INITIAL_PUBLISHING_FILTERS,
              status: "failed",
            })
          }
        >
          View failed
        </Button>
      </div>

      {/* Search and filters */}
      <PublishingFilters
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
      />

      {/* Publishing records */}
      {rows.length > 0 ? (
        <PublishingTable rows={rows} onViewDetails={setSelectedRecordId} />
      ) : (
        <EmptyState
          title="No publications found."
          description="No publishing records match the selected filters."
          action={
            hasActiveFilters ? (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-subtle">
        <span>
          {rows.length} of {publishingRecords.length} platform publications
        </span>

        <span>Europe/Istanbul · Mock data</span>
      </div>

      {/* Details modal */}
      <Modal
        open={Boolean(selectedRecord && selectedPost)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRecordId(null);
          }
        }}
        title="Publication details"
        description="Inspect a single platform publication and its attempt history."
      >
        {selectedRecord && selectedPost && (
          <PublicationDetails record={selectedRecord} post={selectedPost} />
        )}
      </Modal>
    </Page>
  );
}
