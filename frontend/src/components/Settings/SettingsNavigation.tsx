import {
  ChevronRight,
  SlidersHorizontal,
  UserRound,
  UsersRound,
  PanelsTopLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type SettingsSection =
  | "profile"
  | "workspace"
  | "members"
  | "preferences";

type Props = {
  value: SettingsSection;
  onChange: (section: SettingsSection) => void;
};

const SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: PanelsTopLeft,
  },
  {
    id: "members",
    label: "Members",
    icon: UsersRound,
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: SlidersHorizontal,
  },
] as const;

export default function SettingsNavigation({ value, onChange }: Props) {
  return (
    <nav aria-label="Settings sections" className="settings-nav min-w-0">
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const active = value === id;

        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            aria-controls={active ? "settings-content" : undefined}
            onClick={() => onChange(id)}
            className={cn(
              "w-full min-w-0 gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-l-2 border-ink bg-secondary font-semibold"
                : "border-l-2 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <span className="flex min-w-0 items-center gap-3">
              <Icon size={17} aria-hidden="true" className="shrink-0" />
              {label}
            </span>

            {active && (
              <ChevronRight
                size={15}
                aria-hidden="true"
                className="text-subtle"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
