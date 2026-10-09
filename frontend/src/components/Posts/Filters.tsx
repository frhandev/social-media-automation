"use client";

import { Search } from "lucide-react";
import useFilters from "./useFilters";
import { Select } from "../shared";
import { PLATFORMS } from "../layout/PlatformBadge";
import { Button } from "../ui/button";

const statuses = [
  "draft",
  "ready",
  "scheduled",
  "queued",
  "publishing",
  "processing",
  "published",
  "failed",
  "cancelled",
  "partial",
];

function Filters({
  f,
  publishing = false,
}: {
  f: ReturnType<typeof useFilters>;
  publishing?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="search-field mr-auto">
        <Search size={16} />
        <input
          aria-label="Search posts"
          placeholder="Search your posts…"
          value={f.search}
          onChange={(e) => f.setSearch(e.target.value)}
        />
      </div>
      <Select
        label="Filter by status"
        value={f.status}
        onChange={f.setStatus}
        options={[
          { value: "all", label: "All statuses" },
          ...statuses
            .filter((s) => !publishing || !["draft", "partial"].includes(s))
            .map((s) => ({
              value: s,
              label:
                s === "partial"
                  ? "Mixed results"
                  : s.charAt(0).toUpperCase() + s.slice(1),
            })),
        ]}
      />
      <Select
        label="Filter by platform"
        value={f.platform}
        onChange={f.setPlatform}
        options={[
          { value: "all", label: "All platforms" },
          ...(["youtube", "tiktok", "instagram"] as const).map((p) => ({
            value: p,
            label: PLATFORMS[p].label,
          })),
        ]}
      />
      <input
        type="date"
        className="form-control max-w-40"
        aria-label={
          publishing ? "Filter by scheduled date" : "Filter by created date"
        }
        value={f.date}
        onChange={(e) => f.setDate(e.target.value)}
      />
      {(f.search || f.status !== "all" || f.platform !== "all" || f.date) && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            f.setSearch("");
            f.setStatus("all");
            f.setPlatform("all");
            f.setDate("");
          }}
        >
          Clear
        </Button>
      )}
    </div>
  );
}

export default Filters;
