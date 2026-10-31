"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { hasValidationErrors, validateLogin } from "@/lib/auth-validation";

import PasswordInput from "./PasswordInput";
import { LoginValues } from "@/types/auth/LoginValues";

export default function LoginForm() {
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [checked, setChecked] = useState(false);

  const errors = validateLogin(values);

  const emailError = checked || touched.email ? errors.email : "";

  const passwordError = checked || touched.password ? errors.password : "";

  const isValid = checked && !hasValidationErrors(errors);

  function update(field: keyof LoginValues, value: string) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function checkFields(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
  }

  return (
    <section aria-labelledby="login-title">
      <div className="mb-7">
        <p className="eyebrow">ACCOUNT ACCESS</p>

        <h1
          id="login-title"
          className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Welcome back.
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Preview the sign-in experience for your creative workspace.
        </p>
      </div>

      <div className="mb-7 flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
        <LockKeyhole
          size={18}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-brand-2"
        />

        <p className="text-xs leading-6 text-muted-foreground">
          This is a frontend demonstration. Authentication and sessions are not
          enabled.
        </p>
      </div>

      <form noValidate onSubmit={checkFields} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="login-email">Email address</Label>

          <Input
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={values.email}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "login-email-error" : undefined}
            onChange={(event) => update("email", event.target.value)}
            onBlur={() =>
              setTouched((previous) => ({
                ...previous,
                email: true,
              }))
            }
          />

          {emailError && (
            <p
              id="login-email-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {emailError}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-brand-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <PasswordInput
            id="login-password"
            label="Password"
            value={values.password}
            onChange={(value) => update("password", value)}
            onBlur={() =>
              setTouched((previous) => ({
                ...previous,
                password: true,
              }))
            }
            error={passwordError}
            autoComplete="current-password"
          />
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

            <p>
              Fields are valid. No sign-in has occurred because backend
              authentication is not implemented.
            </p>
          </div>
        )}

        <div className="space-y-3 border-t border-border pt-6">
          <Button type="submit" variant="secondary" className="w-full">
            Check fields
          </Button>

          <Button type="button" variant="brutal" disabled className="w-full">
            Sign in — backend required
          </Button>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-foreground hover:text-brand-2 hover:underline"
        >
          Sign up
        </Link>
      </p>

      <div className="mt-7 border-t border-border pt-6">
        <Link
          href="/dashboard"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          Explore demo without signing in
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
