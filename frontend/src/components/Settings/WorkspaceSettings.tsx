"use client";

import { useState } from "react";
import { Building2, RotateCcw, Save } from "lucide-react";

import { workspace } from "@/lib/mock-data";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  name: string;
  onNameChange: (value: string) => void;
  onReset: () => void;
};

export default function WorkspaceSettings({
  name,
  onNameChange,
  onReset,
}: Props) {
  const [touched, setTouched] = useState(false);

  const nameError = !name.trim() ? "Workspace name is required." : "";

  const showError = touched && !!nameError;

  const hasChanges = name !== workspace.name;

  function resetWorkspace() {
    onReset();
    setTouched(false);
  }

  return (
    <section aria-labelledby="workspace-heading" className="space-y-6">
      <div>
        <p className="eyebrow mb-2">WORKSPACE MANAGEMENT</p>

        <h2 id="workspace-heading" className="font-display text-2xl font-bold">
          Workspace settings
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          View your current workspace and plan.
        </p>
      </div>

      <div className="panel space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand">
              <Building2 size={21} className="text-ink" />
            </div>

            <div className="min-w-0">
              <p className="wrap-break-word font-display text-lg font-bold">
                {workspace.name}
              </p>

              <p className="mt-1 text-xs text-subtle">Current workspace</p>
            </div>
          </div>

          <Badge variant="brand">{workspace.plan} plan</Badge>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workspace-name">Workspace name</Label>

          <Input
            id="workspace-name"
            value={name}
            maxLength={100}
            onChange={(event) => onNameChange(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={showError}
            aria-describedby={
              showError ? "workspace-name-error" : "workspace-name-hint"
            }
          />

          {showError ? (
            <p
              id="workspace-name-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {nameError}
            </p>
          ) : (
            <p
              id="workspace-name-hint"
              className="text-xs text-muted-foreground"
            >
              Editing this field only changes a local preview of the name.
            </p>
          )}
        </div>

        {hasChanges && (
          <p className="text-xs font-medium text-brand-2">
            Workspace name changed locally — not saved.
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
          <Button type="button" variant="outline" onClick={resetWorkspace}>
            <RotateCcw size={15} />
            Reset
          </Button>

          <Button type="button" variant="brutal" disabled>
            <Save size={15} />
            Save changes
          </Button>
        </div>
      </div>

      {/* Other workspaces are not members */}
      <div className="panel">
        <h3 className="font-display text-lg font-bold">
          Other demo workspaces
        </h3>

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          These are workspace names, not workspace members. Switching workspaces
          is unavailable in this frontend task.
        </p>

        <ul className="mt-5 divide-y divide-border rounded-lg border border-border">
          {workspace.others.map((other) => (
            <li key={other} className="flex items-center gap-3 p-4">
              <Building2 size={17} className="shrink-0 text-subtle" />

              <span className="min-w-0 wrap-break-word text-sm font-medium">
                {other}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs leading-6 text-subtle">
        Plan changes, workspace creation, and workspace switching require
        backend integration.
      </p>
    </section>
  );
}
