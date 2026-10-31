import type { Metadata } from "next";

import RegisterForm from "@/components/Auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign Up | SocialFlow AI",
  description: "Preview the SocialFlow AI account registration interface.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
