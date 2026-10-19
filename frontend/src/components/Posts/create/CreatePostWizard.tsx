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

import PublishingStep from "./PublishingStep";
import { PublishingMode } from "@/types/post/PublishingMode";

const EMPTY_CONTENT: Content = {
  title: "",
  body: "",
  tags: "",
  cta: "",
};

export default function CreatePostWizard() {
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1: Media
  const [mediaId, setMediaId] = useState("");

  // Step 2: Platforms
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  // Step 3: Platform-specific content
  const [contents, setContents] = useState<PlatformContent>({});

  // Step 5: Publishing
  const [publishingMode, setPublishingMode] = useState<PublishingMode>("now");

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Wizard validation
  const [error, setError] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  function goToStep(target: WizardStep) {
    setStep(target);
    setError("");
  }

  function selectMedia(id: string) {
    const media = mediaItems.find((item) => item.id === id);

    if (id && media?.status !== "ready") return;

    setMediaId(id);
    setError("");
  }

  function togglePlatform(platform: Platform) {
    const account = platformAccounts.find((item) => item.platform === platform);

    if (!account?.connected) return;

    setPlatforms((previous) =>
      previous.includes(platform)
        ? previous.filter((p) => p !== platform)
        : [...previous, platform],
    );

    // Keep previously written content in state.
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

  function isMediaValid() {
    return mediaItems.find((item) => item.id === mediaId)?.status === "ready";
  }

  function arePlatformsValid() {
    return (
      platforms.length > 0 &&
      platforms.every(
        (platform) =>
          platformAccounts.find((account) => account.platform === platform)
            ?.connected === true,
      )
    );
  }

  function isContentValid() {
    return validateAllPlatformContents(platforms, contents);
  }

  function nextStep() {
    // Step 1 -> Step 2
    if (step === 1) {
      if (!isMediaValid()) {
        setError("Select a ready media asset to continue.");
        return;
      }

      goToStep(2);
      return;
    }

    // Step 2 -> Step 3
    if (step === 2) {
      if (!arePlatformsValid()) {
        setError("Select at least one connected platform.");
        return;
      }

      goToStep(3);
      return;
    }

    // Step 3 -> Step 4
    if (step === 3) {
      if (!isContentValid()) {
        setShowValidation(true);
        setError("Complete the required content for all selected platforms.");
        return;
      }

      setShowValidation(false);
      goToStep(4);
      return;
    }

    // Step 4 -> Step 5
    // Revalidate all previous steps.
    if (step === 4) {
      if (!isMediaValid()) {
        goToStep(1);
        setError(
          "The selected media is no longer ready. Choose a ready asset.",
        );
        return;
      }

      if (!arePlatformsValid()) {
        goToStep(2);
        setError(
          "Review your selected platforms. At least one connected account is required.",
        );
        return;
      }

      if (!isContentValid()) {
        setShowValidation(true);
        goToStep(3);
        setError("Complete the required content for all selected platforms.");
        return;
      }

      setShowValidation(false);
      goToStep(5);
      return;
    }

    // Step 5 has no execution action in TASK #13.
  }

  function previousStep() {
    if (step === 1) return;

    const previous: WizardStep =
      step === 5 ? 4 : step === 4 ? 3 : step === 3 ? 2 : 1;

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
          // Allow navigation backward only.
          if (target <= step) {
            goToStep(target);
          }
        }}
      />

      <p className="text-xs text-subtle">Step {step} of 5</p>

      {/* Step 1 */}
      {step === 1 && (
        <MediaSelectionStep mediaId={mediaId} onSelect={selectMedia} />
      )}

      {/* Step 2 */}
      {step === 2 && (
        <PlatformSelectionStep
          platforms={platforms}
          onToggle={togglePlatform}
        />
      )}

      {/* Step 3 */}
      {step === 3 && (
        <ContentStep
          platforms={platforms}
          mediaId={mediaId}
          contents={contents}
          onContentChange={updateContent}
          showValidation={showValidation}
        />
      )}

      {/* Step 4 */}
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

      {/* Step 5 */}
      {step === 5 && (
        <PublishingStep
          mode={publishingMode}
          onModeChange={setPublishingMode}
          scheduledDate={scheduledDate}
          onDateChange={setScheduledDate}
          scheduledTime={scheduledTime}
          onTimeChange={setScheduledTime}
          mediaId={mediaId}
          platforms={platforms}
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

        {step === 5 ? (
          <Button type="button" variant="brutal" size="lg" disabled>
            Publishing — backend required
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button type="button" variant="brutal" size="lg" onClick={nextStep}>
            {step === 1
              ? "Select & continue"
              : step === 2
                ? "Continue to content"
                : step === 3
                  ? "Continue to review"
                  : "Continue to publishing"}

            <ArrowRight size={16} />
          </Button>
        )}
      </footer>
    </Page>
  );
}
