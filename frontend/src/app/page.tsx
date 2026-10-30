import type { Metadata } from "next";

import LandingNavbar from "@/components/Landing/LandingNavbar";
import HeroSection from "@/components/Landing/HeroSection";
import DashboardPreview from "@/components/Landing/DashboardPreview";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import HowItWorksSection from "@/components/Landing/HowItWorksSection";
import PlatformSection from "@/components/Landing/PlatformSection";
import CTASection from "@/components/Landing/CTASection";
import LandingFooter from "@/components/Landing/LandingFooter";

export const metadata: Metadata = {
  title: "SocialFlow AI | One Idea. Every Channel.",
  description:
    "Explore SocialFlow AI, an AI-assisted social media content management project for organizing content across YouTube, TikTok, and Instagram.",
  openGraph: {
    title: "SocialFlow AI | One Idea. Every Channel.",
    description:
      "Plan, organize, and explore multi-platform social media content in one workspace. Try the interactive frontend demo.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-brand focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <LandingNavbar />

      <main id="main-content" className="min-w-0">
        <HeroSection />
        <DashboardPreview />
        <FeaturesSection />
        <HowItWorksSection />
        <PlatformSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
}
