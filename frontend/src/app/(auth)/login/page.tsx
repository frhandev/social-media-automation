import type { Metadata } from "next";

import LoginForm from "@/components/Auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | SocialFlow AI",
  description: "Preview the SocialFlow AI sign-in interface.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
