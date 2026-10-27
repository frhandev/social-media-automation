import { Bell, Clock3, Globe2, LockKeyhole } from "lucide-react";

import { CALENDAR_TIME_ZONE } from "@/lib/calendar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIMEZONE = CALENDAR_TIME_ZONE;

export default function PreferencesSettings() {
  return (
    <section aria-labelledby="preferences-heading" className="space-y-6">
      <div>
        <p className="eyebrow mb-2">WORKSPACE PREFERENCES</p>

        <h2
          id="preferences-heading"
          className="font-display text-2xl font-bold"
        >
          Preferences
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Display conventions and future notification settings.
        </p>
      </div>

      {/* Timezone */}
      <div className="panel space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <Clock3 size={19} className="text-brand-2" />

            <h3 className="font-display text-lg font-bold">Date & time</h3>
          </div>

          <Badge variant="outline">Read only</Badge>
        </div>

        <div className="max-w-lg space-y-2">
          <Label htmlFor="settings-timezone">Workspace timezone</Label>

          <div className="relative">
            <Globe2
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 text-subtle"
            />

            <Input
              id="settings-timezone"
              value={TIMEZONE}
              readOnly
              aria-describedby="timezone-hint"
              className="cursor-default bg-secondary/50 pl-10"
            />
          </div>

          <p
            id="timezone-hint"
            className="text-xs leading-6 text-muted-foreground"
          >
            Publishing, Calendar, and Analytics currently use Europe/Istanbul.
            Timezone selection is not supported in this frontend task.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
          <LockKeyhole size={18} className="mt-0.5 shrink-0" />

          <p className="text-xs leading-6 text-muted-foreground">
            This timezone is fixed to keep scheduled dates and analytics
            consistent. Other timezones may be supported after the backend and
            scheduling services are ready.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Bell size={19} className="mt-1 shrink-0 text-brand-2" />

            <div>
              <h3 className="font-display text-lg font-bold">Notifications</h3>

              <p className="mt-2 max-w-md text-xs leading-6 text-muted-foreground">
                Configure alerts for publishing results, scheduling activity,
                and workspace events.
              </p>
            </div>
          </div>

          <Badge variant="outline">Coming later</Badge>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">
            Notification preferences are unavailable.
          </p>

          <Button type="button" variant="outline" size="sm" disabled>
            Configure notifications
          </Button>
        </div>
      </div>
    </section>
  );
}
