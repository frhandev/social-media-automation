"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { mediaItems, platformAccounts } from "@/lib/mock-data";

import type { Platform } from "@/types/platform/Platform";
import type { Content } from "@/types/post/Content";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/shared";

import WizardStepper, { type WizardStep } from "./WizardStepper";

import MediaSelectionStep from "./MediaSelectionStep";
import PlatformSelectionStep from "./PlatformSelectionStep";

import ContentStep from "./ContentStep";
import { PlatformContent } from "@/types/platform/PlatformContent";

const EMPTY_CONTENT: Content = {
  title: "",
  body: "",
  tags: "",
  cta: "",
};

export default function CreatePostWizard() {
  const [step, setStep] = useState<WizardStep>(1);

  const [mediaId, setMediaId] = useState("");

  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const [contents, setContents] = useState<PlatformContent>({});

  const [error, setError] = useState("");

  function selectMedia(id: string) {
    const media = mediaItems.find((m) => m.id === id);

    if (id && media?.status !== "ready") return;

    setMediaId(id);
    setError("");
  }

  function togglePlatform(platform: Platform) {
    const account = platformAccounts.find((a) => a.platform === platform);

    if (!account?.connected) return;

    setPlatforms((previous) =>
      previous.includes(platform)
        ? previous.filter((p) => p !== platform)
        : [...previous, platform],
    );

    setError("");
  }

  function updateContent(platform: Platform, fields: Partial<Content>) {
    setContents((previous) => ({
      ...previous,
      [platform]: {
        ...EMPTY_CONTENT,
        ...previous[platform],
        ...fields,
      },
    }));
  }

  function nextStep() {
    if (step === 1) {
      const media = mediaItems.find((m) => m.id === mediaId);

      if (media?.status !== "ready") {
        setError("Select a ready media asset to continue.");
        return;
      }

      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (platforms.length === 0) {
        setError("Select at least one connected platform.");
        return;
      }

      const allConnected = platforms.every(
        (platform) =>
          platformAccounts.find((account) => account.platform === platform)
            ?.connected === true,
      );

      if (!allConnected) {
        setError("One or more selected platforms are not connected.");
        return;
      }

      setError("");
      setStep(3);
    }
  }

  function previousStep() {
    if (step === 1) return;

    setStep((previous) => (previous === 3 ? 2 : 1));

    setError("");
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Create content"
        title="Create post"
        description="One idea. Your voice. Every channel."
      />

      <WizardStepper
        step={step}
        onStepChange={(nextStep) => {
          if (nextStep <= step) {
            setStep(nextStep);
            setError("");
          }
        }}
      />

      <p className="text-xs text-subtle">Step {step} of 5</p>

      {step === 1 && (
        <MediaSelectionStep mediaId={mediaId} onSelect={selectMedia} />
      )}

      {step === 2 && (
        <PlatformSelectionStep
          platforms={platforms}
          onToggle={togglePlatform}
        />
      )}

      {step === 3 && (
        <ContentStep
          platforms={platforms}
          mediaId={mediaId}
          contents={contents}
          onContentChange={updateContent}
        />
      )}

      {error && (
        <p role="alert" className="error-note">
          {error}
        </p>
      )}

      <footer className="wizard-footer">
        {step === 1 ? (
          <Button variant="ghost" asChild>
            <Link href="/posts">
              <ArrowLeft size={15} />
              All posts
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" onClick={previousStep}>
            <ArrowLeft size={15} />
            Back
          </Button>
        )}

        {step < 3 ? (
          <Button variant="brutal" size="lg" onClick={nextStep}>
            {step === 1 ? "Select & continue" : "Continue to content"}

            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button variant="brutal" size="lg" disabled>
            Review — next task
            <ArrowRight size={16} />
          </Button>
        )}
      </footer>
    </Page>
  );
}
