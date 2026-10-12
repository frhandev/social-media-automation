"use client";

import { StatusBadge } from "@/components/layout/StatusBadge";
import MediaCard from "@/components/Media/MediaCard";
import { MediaFacts, MediaThumb, SectionTitle } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { mediaItems } from "@/lib/mock-data";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type MediaSelectionStepProps = {
  mediaId: string;
  onSelect: (id: string) => void;
};

function MediaSelectionStep({ mediaId, onSelect }: MediaSelectionStepProps) {
  const [search, setSearch] = useState("");

  const media = mediaItems.find((m) => m.id === mediaId);

  const filteredMedia = mediaItems.filter((m) =>
    m.filename.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="editor-layout">
      <section>
        <SectionTitle>Start with the visual</SectionTitle>

        <div className="search-field mb-5">
          <Search size={16} />
          <input
            aria-label="Search media"
            placeholder="Search media library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredMedia.length > 0 ? (
          <div className="media-picker-grid grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredMedia.map((item) => (
              <MediaCard
                key={item.id}
                media={item}
                selectable
                selected={mediaId === item.id}
                onClick={() => onSelect(item.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No matching media found.
          </p>
        )}
        <p className="mt-5 text-xs leading-6 text-muted-foreground">
          Select an existing ready asset. File upload is not implemented yet.{" "}
          <Link href="/media" className="font-semibold underline">
            Open Media Library
          </Link>
        </p>
      </section>

      <aside>
        <SectionTitle> Selected Media</SectionTitle>

        {media ? (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <MediaThumb media={media} playback />

            <div className="space-y-4 p-5">
              <p className="break-all text-sm font-semibold">
                {media.filename}
              </p>

              <StatusBadge status={media.status} />
              <MediaFacts media={media} />

              <Button variant="ghost" size="sm" onClick={() => onSelect("")}>
                Remove selection
              </Button>
            </div>
          </div>
        ) : (
          <div className="empty-state min-h-64">
            <p className="font-display text-lg font-semibold">
              Choose your media
            </p>
            <p>Select an image or video to continue.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default MediaSelectionStep;
