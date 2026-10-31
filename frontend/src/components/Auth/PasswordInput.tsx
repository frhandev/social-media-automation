"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  autoComplete: "current-password" | "new-password";
};

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  autoComplete,
}: Props) {
  const [visible, setVisible] = useState(false);

  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [hint ? hintId : "", error ? errorId : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder="Enter your password"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className="pr-12"
        />

        <button
          type="button"
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          aria-pressed={visible}
          onClick={() => setVisible((previous) => !previous)}
          className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visible ? (
            <EyeOff size={17} aria-hidden="true" />
          ) : (
            <Eye size={17} aria-hidden="true" />
          )}
        </button>
      </div>

      {hint && (
        <p id={hintId} className="text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
