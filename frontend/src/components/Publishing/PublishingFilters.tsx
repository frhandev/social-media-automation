import { PublishingFiltersState } from "@/lib/publishing";
import { Platform } from "@/types/platform/Platform";
import { PublishingStatus } from "@/types/publishing/PublishingStatus";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { Select } from "../shared";
import { PLATFORMS } from "../layout/PlatformBadge";

type Props = {
  filters: PublishingFiltersState;
  onChange: (filters: PublishingFiltersState) => void;
  onClear: () => void;
};

const STATUSES: PublishingStatus[] = [
  "scheduled",
  "queued",
  "publishing",
  "published",
  "failed",
  "cancelled",
];

const PLATFORMS_LIST: Platform[] = ["youtube", "tiktok", "instagram"];

function PublishingFilters({ filters, onChange, onClear }: Props) {
  const hasFilters =
    filters.search !== "" ||
    filters.platform !== "all" ||
    filters.status !== "all" ||
    filters.date !== "";

  function update(fields: Partial<PublishingFiltersState>) {
    onChange({
      ...filters,
      ...fields,
    });
  }

  return (
    <section aria-label="Publishing filters" className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="search-field mr-auto">
          <Search size={16} />

          <input
            aria-label="Search publications by post title"
            placeholder="Search publications..."
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
          />
        </div>

        <Select
          label="Filter publishing by platform"
          value={filters.platform}
          onChange={(value) =>
            update({
              platform: value as Platform | "all",
            })
          }
          options={[
            { value: "all", label: "All platforms" },
            ...PLATFORMS_LIST.map((platform) => ({
              value: platform,
              label: PLATFORMS[platform].label,
            })),
          ]}
        />

        <Select
          label="Filter publishing by status"
          value={filters.status}
          onChange={(value) =>
            update({
              status: value as PublishingStatus | "all",
            })
          }
          options={[
            { value: "all", label: "All statuses" },
            ...STATUSES.map((status) => ({
              value: status,
              label: status.charAt(0).toUpperCase() + status.slice(1),
            })),
          ]}
        />

        <input
          type="date"
          aria-label="Filter by publishing activity date"
          className="form-control w-full sm:max-w-44"
          value={filters.date}
          onChange={(event) => update({ date: event.target.value })}
        />

        {hasFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            <X size={14} />
            Clear
          </Button>
        )}
      </div>

      <p className="text-[11px] text-subtle">
        Date filter: latest publishing activity, or scheduled date if no
        activity exists. All dates use Europe/Istanbul.
      </p>
    </section>
  );
}


export default PublishingFilters;