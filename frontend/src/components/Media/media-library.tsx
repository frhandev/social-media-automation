"use client";

import { Search, Upload, X } from "lucide-react";
import { PageHeader } from "../layout/PageHeader";
import {
  EmptyState,
  ErrorState,
  MediaFacts,
  MediaThumb,
  Modal,
  Page,
  Skeleton,
  Tabs,
} from "../shared";
import { Button } from "../ui/button";
import MediaCard from "./MediaCard";
import UploadArea from "./UploadArea";
import { StatusBadge } from "../layout/StatusBadge";
import { formatDate } from "@/lib/helperFunctions";
import { useEffect, useState } from "react";
import Media from "@/types/media/Media";
import { mediaItems } from "@/lib/mock-data";

function MediaLibrary() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Media | null>(null);
  const [state, setState] = useState("ready");

  useEffect(() => {
    const t = setTimeout(
      () =>
        setState(
          new URLSearchParams(window.location.search).get("state") || "ready",
        ),
      0,
    );
    return () => clearTimeout(t);
  }, []);

  const media =
    state === "empty"
      ? []
      : mediaItems.filter(
          (m) =>
            m.filename.toLowerCase().includes(search.toLowerCase()) &&
            (filter === "All" ||
              (filter === "Videos"
                ? m.type === "video"
                : filter === "Images"
                  ? m.type === "image"
                  : m.status === filter.toLowerCase())),
        );

  const current = selected
    ? mediaItems.find((m) => m.id === selected.id) || selected
    : null;

  return (
    <Page>
      <PageHeader
        eyebrow="Content assets"
        title="Media Library"
        description="A home for your ideas, before they go everywhere."
        action={
          <Button
            variant="brutal"
            size="lg"
            onClick={() => setUploadOpen(true)}
          >
            Upload media <Upload size={16} />
          </Button>
        }
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label="Search media"
            placeholder="Find something good…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            {media.length}
          </span>{" "}
          assets in your library
        </p>
      </div>
      <Tabs
        items={["All", "Videos", "Images", "Processing", "Ready", "Failed"]}
        value={filter}
        onChange={setFilter}
        label="Media filters"
      />
      {state === "loading" ? (
        <div className="media-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-64" />
          ))}
        </div>
      ) : state === "error" ? (
        <ErrorState onRetry={() => setState("ready")} />
      ) : media.length ? (
        <div className="media-grid">
          {media.map((m) => (
            <MediaCard key={m.id} media={m} onClick={() => setSelected(m)} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            search || filter !== "All" ? "No matching media." : "No media yet."
          }
          description={
            search || filter !== "All"
              ? "Try another search or clear your filters."
              : "Upload your first image or video to start creating content."
          }
          action={
            <Button
              variant="outline"
              onClick={() => {
                if (search || filter !== "All") {
                  setSearch("");
                  setFilter("All");
                } else {
                  setState("ready");
                  setUploadOpen(true);
                }
              }}
            >
              {search || filter !== "All" ? "Clear filters" : "Upload media →"}
            </Button>
          }
        />
      )}
      <div className="flex items-center gap-2 border-t border-border pt-5 text-xs text-subtle">
        <span className="size-1.5 rounded-full bg-success" />
        Your creative assets, all in one place.
        <span className="ml-auto">LOCAL DEMO</span>
      </div>
      <Modal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        title="Make room for your next idea."
        description="Uploads are simulated locally. Files never leave this browser."
      >
        <UploadArea
          onDone={() => {
            setUploadOpen(false);
            setState("ready");
          }}
        />
      </Modal>
      <Modal
        open={!!current}
        onOpenChange={() => setSelected(null)}
        title={current?.filename || "Media details"}
        description="Asset details and processing information."
      >
        {current && (
          <>
            <MediaThumb media={current} playback />
            <div className="flex items-center justify-between">
              <StatusBadge status={current.status} />
              <span className="text-xs text-subtle">
                Uploaded {formatDate(current.uploadedAt)}
              </span>
            </div>
            <MediaFacts media={current} />
            {current.status === "failed" && (
              <div className="error-note">
                We couldn’t process this file. Try a different export or retry
                processing.
                <Button
                  className="mt-3"
                  variant="outline"
                  onClick={() => {
                    // update((s) => ({
                    //   ...s,
                    //   media: s.media.map((m) =>
                    //     m.id === current.id ? { ...m, status: "ready" } : m,
                    //   ),
                    // }));
                    // notify("Processing retry completed in the demo.");
                  }}
                >
                  Retry processing
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={() => setSelected(null)}>
              <X size={14} />
              Close details
            </Button>
          </>
        )}
      </Modal>
    </Page>
  );
}

export default MediaLibrary;
