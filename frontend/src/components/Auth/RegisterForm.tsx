"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { CheckCircle2, UserRoundPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { hasValidationErrors, validateRegister } from "@/lib/auth-validation";

import PasswordInput from "./PasswordInput";
import { RegisterValues } from "@/types/auth/RegisterValues";

type FieldName = keyof RegisterValues;

const INITIAL_VALUES: RegisterValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES);

  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [checked, setChecked] = useState(false);

  const errors = validateRegister(values);

  const isValid = checked && !hasValidationErrors(errors);

  function update(field: FieldName, value: string) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function touch(field: FieldName) {
    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  }

  function visibleError(field: FieldName) {
    return checked || touched[field] ? errors[field] : "";
  }

  function checkFields(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
  }

  const fullNameError = visibleError("fullName");
  const emailError = visibleError("email");

  return (
    <section aria-labelledby="register-title">
      <div className="mb-7">
        <p className="eyebrow">CREATE YOUR ACCOUNT</p>

        <h1
          id="register-title"
          className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Join the flow.
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Preview account registration. Creating real accounts requires backend
          integration.
        </p>
      </div>

      <div className="mb-7 flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
        <UserRoundPlus
          size={18}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-brand-2"
        />

        <p className="text-xs leading-6 text-muted-foreground">
          Validation is local to this page. No account will be created and no
          data will be submitted.
        </p>
      </div>

      <form noValidate onSubmit={checkFields} className="space-y-5">
        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="register-name">Full name</Label>

          <Input
            id="register-name"
            name="fullName"
            type="text"
            autoComplete="name"
            maxLength={100}
            placeholder="Alex Morgan"
            value={values.fullName}
            aria-invalid={Boolean(fullNameError)}
            aria-describedby={fullNameError ? "register-name-error" : undefined}
            onChange={(event) => update("fullName", event.target.value)}
            onBlur={() => touch("fullName")}
          />

          {fullNameError && (
            <p
              id="register-name-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {fullNameError}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="register-email">Email address</Label>

          <Input
            id="register-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            placeholder="name@example.com"
            value={values.email}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "register-email-error" : undefined}
            onChange={(event) => update("email", event.target.value)}
            onBlur={() => touch("email")}
          />

          {emailError && (
            <p
              id="register-email-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {emailError}
            </p>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          id="register-password"
          label="Password"
          value={values.password}
          onChange={(value) => update("password", value)}
          onBlur={() => touch("password")}
          error={visibleError("password")}
          autoComplete="new-password"
          hint="At least 8 characters for this demo."
        />

        {/* Confirmation */}
        <PasswordInput
          id="register-confirm-password"
          label="Confirm password"
          value={values.confirmPassword}
          onChange={(value) => update("confirmPassword", value)}
          onBlur={() => touch("confirmPassword")}
          error={visibleError("confirmPassword")}
          autoComplete="new-password"
        />

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
              Fields are valid. No account was created. Registration will be
              enabled after backend integration.
            </p>
          </div>
        )}

        <div className="space-y-3 border-t border-border pt-6">
          <Button type="submit" variant="secondary" className="w-full">
            Check fields
          </Button>

          <Button type="button" variant="brutal" disabled className="w-full">
            Create account — backend required
          </Button>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground hover:text-brand-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
