import type { Metadata } from "next";

import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | SocialFlow AI",
  description: "Preview the SocialFlow AI password recovery interface.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
