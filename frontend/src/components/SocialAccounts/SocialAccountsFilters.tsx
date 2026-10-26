import { cn } from "@/lib/utils";
import { SocialAccountsFilter } from "@/types/platform/SocialAccountsFilter";

type Props = {
  value: SocialAccountsFilter;
  onChange: (value: SocialAccountsFilter) => void;
};

const FILTERS: {
  value: SocialAccountsFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All accounts",
  },
  {
    value: "connected",
    label: "Connected",
  },
  {
    value: "attention",
    label: "Needs attention",
  },
];

export default function SocialAccountsFilters({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Filter social accounts"
      className="flex flex-wrap gap-2"
    >
      {FILTERS.map((filter) => {
        const active = value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(filter.value)}
            className={cn(
              "rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors",
              active
                ? "border-ink bg-ink text-ink-foreground"
                : "border-border bg-card text-muted-foreground hover:border-ink hover:text-foreground",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
