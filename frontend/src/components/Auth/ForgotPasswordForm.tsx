"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { validateEmail } from "@/lib/auth-validation";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [checked, setChecked] = useState(false);

  const emailError = validateEmail(email);

  const visibleError = touched || checked ? emailError : "";

  const isValid = checked && !emailError;

  function checkFields(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
  }

  return (
    <section aria-labelledby="recovery-title">
      <div className="mb-7">
        <p className="eyebrow">ACCOUNT RECOVERY</p>

        <h1
          id="recovery-title"
          className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Forgot your password?
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Preview the password recovery interface.
        </p>
      </div>

      <div className="mb-7 flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
        <Mail
          size={18}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-brand-2"
        />

        <p className="text-xs leading-6 text-muted-foreground">
          Password recovery will be available after backend integration. No
          reset email will be sent from this page.
        </p>
      </div>

      <form noValidate onSubmit={checkFields} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="recovery-email">Email address</Label>

          <Input
            id="recovery-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            aria-invalid={Boolean(visibleError)}
            aria-describedby={visibleError ? "recovery-email-error" : undefined}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setTouched(true)}
          />

          {visibleError && (
            <p
              id="recovery-email-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {visibleError}
            </p>
          )}
        </div>

        {isValid && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-xs leading-6"
          >
            <CheckCircle2
              size={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-success"
            />

            <p>Email format is valid. No recovery message has been sent.</p>
          </div>
        )}

        <div className="space-y-3 border-t border-border pt-6">
          <Button type="submit" variant="secondary" className="w-full">
            Check email
          </Button>

          <Button type="button" variant="brutal" disabled className="w-full">
            Send reset link — backend required
          </Button>
        </div>
      </form>

      <Link
        href="/login"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-brand-2"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to sign in
      </Link>
    </section>
  );
}
