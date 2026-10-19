"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { mediaItems, platformAccounts } from "@/lib/mock-data";

import { validateAllPlatformContents } from "@/lib/helperFunctions";

import type { Platform } from "@/types/platform/Platform";
import type { PlatformContent } from "@/types/platform/PlatformContent";
import type { Content } from "@/types/post/Content";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/shared";

import WizardStepper, { type WizardStep } from "./WizardStepper";

import MediaSelectionStep from "./MediaSelectionStep";
import PlatformSelectionStep from "./PlatformSelectionStep";
import ContentStep from "./ContentStep";
import ReviewStep from "./ReviewStep";

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

  const [showValidation, setShowValidation] = useState(false);

  function goToStep(target: WizardStep) {
    setStep(target);
    setError("");
  }

  function selectMedia(id: string) {
    const media = mediaItems.find((item) => item.id === id);

    if (id && media?.status !== "ready") {
      return;
    }

    setMediaId(id);
    setError("");
  }

  function togglePlatform(platform: Platform) {
    const account = platformAccounts.find((item) => item.platform === platform);

    if (!account?.connected) {
      return;
    }

    setPlatforms((previous) =>
      previous.includes(platform)
        ? previous.filter((p) => p !== platform)
        : [...previous, platform],
    );

    // Keep previously written platform content.
    // Only update the selected platforms.
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

    setError("");
  }

  function nextStep() {
    // Step 1 -> Step 2
    if (step === 1) {
      const media = mediaItems.find((item) => item.id === mediaId);

      if (media?.status !== "ready") {
        setError("Select a ready media asset to continue.");
        return;
      }

      goToStep(2);
      return;
    }

    // Step 2 -> Step 3
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

      goToStep(3);
      return;
    }

    // Step 3 -> Step 4
    if (step === 3) {
      const isValid = validateAllPlatformContents(platforms, contents);

      if (!isValid) {
        setShowValidation(true);
        setError("Complete the required content for all selected platforms.");
        return;
      }

      setShowValidation(false);
      goToStep(4);
    }
  }

  function previousStep() {
    if (step === 1) return;

    const previous: WizardStep = step === 4 ? 3 : step === 3 ? 2 : 1;

    goToStep(previous);
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
        onStepChange={(target) => {
          if (target <= step) {
            goToStep(target);
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
          showValidation={showValidation}
        />
      )}

      {step === 4 && (
        <ReviewStep
          mediaId={mediaId}
          platforms={platforms}
          contents={contents}
          onEditMedia={() => goToStep(1)}
          onEditPlatforms={() => goToStep(2)}
          onEditContent={() => goToStep(3)}
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
          <Button type="button" variant="ghost" onClick={previousStep}>
            <ArrowLeft size={15} />
            Back
          </Button>
        )}

        {step === 4 ? (
          <Button type="button" variant="brutal" size="lg" disabled>
            Publish — next task
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button type="button" variant="brutal" size="lg" onClick={nextStep}>
            {step === 1
              ? "Select & continue"
              : step === 2
                ? "Continue to content"
                : "Continue to review"}

            <ArrowRight size={16} />
          </Button>
        )}
      </footer>
    </Page>
  );
}
