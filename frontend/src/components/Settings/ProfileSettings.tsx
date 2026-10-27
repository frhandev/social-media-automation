"use client";

import { useState } from "react";
import { RotateCcw, Save, UserRound } from "lucide-react";

import { user } from "@/lib/mock-data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Props = {
  fullName: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onReset: () => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileSettings({
  fullName,
  email,
  onFullNameChange,
  onEmailChange,
  onReset,
}: Props) {
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
  });

  const [checked, setChecked] = useState(false);

  const nameError = !fullName.trim() ? "Full name is required." : "";

  const emailError = !email.trim()
    ? "Email address is required."
    : !EMAIL_PATTERN.test(email.trim())
      ? "Enter a valid email address."
      : "";

  const showNameError = (touched.fullName || checked) && !!nameError;

  const showEmailError = (touched.email || checked) && !!emailError;

  const isValid = !nameError && !emailError;

  const hasChanges = fullName !== user.fullName || email !== user.email;

  function resetProfile() {
    onReset();
    setTouched({
      fullName: false,
      email: false,
    });
    setChecked(false);
  }

  return (
    <section aria-labelledby="profile-heading" className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">PERSONAL INFORMATION</p>

          <h2 id="profile-heading" className="font-display text-2xl font-bold">
            Profile settings
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Account details associated with your profile.
          </p>
        </div>

        <Badge variant="outline">Demo profile</Badge>
      </div>

      <div className="panel space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-brand font-display text-xl font-bold text-ink shadow-brutal-xs">
            {user.initials}
          </div>

          <div className="min-w-0">
            <p className="wrap-break-word font-display text-lg font-bold">
              {user.fullName}
            </p>

            <p className="mt-1 wrap-break-word text-xs text-subtle">
              {user.email}
            </p>

            <p className="mt-2 text-[11px] text-muted-foreground">
              Profile photo management is not available yet.
            </p>
          </div>
        </div>

        {/* Local preview form */}
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setChecked(true);
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="profile-full-name">Full name</Label>

            <Input
              id="profile-full-name"
              name="fullName"
              autoComplete="name"
              value={fullName}
              maxLength={100}
              aria-invalid={showNameError}
              aria-describedby={
                showNameError ? "profile-name-error" : undefined
              }
              onChange={(event) => onFullNameChange(event.target.value)}
              onBlur={() =>
                setTouched((previous) => ({
                  ...previous,
                  fullName: true,
                }))
              }
              placeholder="Enter your full name"
            />

            {showNameError && (
              <p
                id="profile-name-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {nameError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email address</Label>

            <Input
              id="profile-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              maxLength={254}
              aria-invalid={showEmailError}
              aria-describedby={
                showEmailError ? "profile-email-error" : undefined
              }
              onChange={(event) => onEmailChange(event.target.value)}
              onBlur={() =>
                setTouched((previous) => ({
                  ...previous,
                  email: true,
                }))
              }
              placeholder="name@example.com"
            />

            {showEmailError && (
              <p
                id="profile-email-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {emailError}
              </p>
            )}
          </div>

          <div className="rounded-md border border-border bg-secondary/40 p-4">
            <div className="flex items-start gap-3">
              <UserRound size={17} className="mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-semibold">Local preview only</p>

                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  You can edit these fields to test the form. Changes are not
                  saved to your account or workspace.
                </p>

                {hasChanges && (
                  <p className="mt-2 text-xs font-semibold text-brand-2">
                    Unsaved preview changes
                  </p>
                )}
              </div>
            </div>
          </div>

          {checked && isValid && (
            <p role="status" className="text-xs text-success">
              Fields are valid. Saving will be available after backend
              integration.
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={resetProfile}>
              <RotateCcw size={15} />
              Reset
            </Button>

            <Button type="submit" variant="secondary">
              Check fields
            </Button>

            <Button type="button" variant="brutal" disabled>
              <Save size={15} />
              Save changes
            </Button>
          </div>

          <p className="text-right text-[11px] text-subtle">
            Saving requires ASP.NET Core integration.
          </p>
        </form>
      </div>
    </section>
  );
}
