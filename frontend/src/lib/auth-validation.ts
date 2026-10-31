import { LoginValues } from "@/types/auth/LoginValues";
import { RegisterValues } from "@/types/auth/RegisterValues";

export type LoginErrors = Record<keyof LoginValues, string>;

export type RegisterErrors = Record<keyof RegisterValues, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string {
  const value = email.trim();

  if (!value) {
    return "Email is required.";
  }

  if (!EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address.";
  }

  return "";
}

export function validateFullName(name: string): string {
  if (!name.trim()) {
    return "Full name is required.";
  }

  return "";
}

export function validateLoginPassword(password: string): string {
  if (!password.trim()) {
    return "Password is required.";
  }

  return "";
}

export function validateRegistrationPassword(password: string): string {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return "";
}

export function validateConfirmPassword(
  password: string,
  confirmation: string,
): string {
  if (!confirmation) {
    return "Confirm your password.";
  }

  if (confirmation !== password) {
    return "Passwords do not match.";
  }

  return "";
}

export function validateLogin(values: LoginValues): LoginErrors {
  return {
    email: validateEmail(values.email),
    password: validateLoginPassword(values.password),
  };
}

export function validateRegister(values: RegisterValues): RegisterErrors {
  return {
    fullName: validateFullName(values.fullName),
    email: validateEmail(values.email),
    password: validateRegistrationPassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.password,
      values.confirmPassword,
    ),
  };
}

export function hasValidationErrors(
  errors: LoginErrors | RegisterErrors,
): boolean {
  return Object.values(errors).some(Boolean);
}
