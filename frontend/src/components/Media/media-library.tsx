"use client";

import { useState } from "react";

import { Search, Upload, X } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/layout/StatusBadge";
import {
  EmptyState,
  MediaFacts,
  MediaThumb,
  Modal,
  Page,
  Tabs,
} from "@/components/shared";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/helperFunctions";
import { mediaItems } from "@/lib/mock-data";

import type Media from "@/types/media/Media";

import MediaCard from "./MediaCard";

export default function MediaLibrary() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Media | null>(null);

  const hasFilters = search.trim() !== "" || filter !== "All";

  const media = mediaItems.filter(
    (item) =>
      item.filename.toLowerCase().includes(search.trim().toLowerCase()) &&
      (filter === "All" ||
        (filter === "Videos"
          ? item.type === "video"
          : filter === "Images"
            ? item.type === "image"
            : item.status === filter.toLowerCase())),
  );

  const current = selected
    ? mediaItems.find((item) => item.id === selected.id)
    : undefined;

  function clearFilters() {
    setSearch("");
    setFilter("All");
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Content assets"
        title="Media Library"
        description="Explore the media assets available in the demo workspace."
        action={
          <div className="text-right">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled
              title="Media upload requires backend integration"
            >
              <Upload size={16} />
              Upload media
            </Button>

            <p className="mt-2 text-[11px] text-subtle">
              Backend integration required
            </p>
          </div>
        }
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="search-field">
          <Search size={16} aria-hidden="true" />

          <input
            aria-label="Search media"
            placeholder="Find media..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          <strong className="mr-1 text-foreground">{media.length}</strong>
          matching assets
        </p>
      </div>

      <Tabs
        items={["All", "Videos", "Images", "Processing", "Ready", "Failed"]}
        value={filter}
        onChange={setFilter}
        label="Media filters"
      />

      {media.length > 0 ? (
        <div className="media-grid">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              media={item}
              onClick={() => setSelected(item)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={hasFilters ? "No matching media" : "No media available"}
          description={
            hasFilters
              ? "Try a different search or clear the filters."
              : "This demo currently has no media records."
          }
          action={
            hasFilters ? (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}

      <p className="border-t border-border pt-5 text-xs text-subtle">
        Demo media records · No actual uploads or processing operations are
        performed.
      </p>

      <Modal
        open={Boolean(current)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={current?.filename ?? "Media details"}
        description="Demo asset information and processing status."
      >
        {current && (
          <div className="space-y-5">
            <MediaThumb media={current} playback />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge status={current.status} />

              <span className="text-xs text-subtle">
                Uploaded {formatDate(current.uploadedAt)}
              </span>
            </div>

            <MediaFacts media={current} />

            {current.status === "failed" && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm font-semibold">Media processing failed</p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Retry requires backend integration. No processing is performed
                  in this demo.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  disabled
                >
                  Retry processing
                </Button>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => setSelected(null)}
            >
              <X size={14} />
              Close details
            </Button>
          </div>
        )}
      </Modal>
    </Page>
  );
}
