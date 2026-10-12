"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { mediaItems, platformAccounts } from "@/lib/mock-data";
import type { Platform } from "@/types/platform/Platform";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/shared";

import WizardStepper from "./WizardStepper";
import MediaSelectionStep from "./MediaSelectionStep";
import PlatformSelectionStep from "./PlatformSelectionStep";

export default function CreatePostWizard() {
  const [step, setStep] = useState<1 | 2>(1);
  const [mediaId, setMediaId] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
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
  }

  function nextStep() {
    const media = mediaItems.find((m) => m.id === mediaId);

    if (media?.status !== "ready") {
      setError("Select a ready media asset to continue.");
      return;
    }

    setError("");
    setStep(2);
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
          setStep(nextStep);
          setError("");
        }}
      />

      {step === 1 ? (
        <MediaSelectionStep mediaId={mediaId} onSelect={selectMedia} />
      ) : (
        <PlatformSelectionStep
          platforms={platforms}
          onToggle={togglePlatform}
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
          <Button
            variant="ghost"
            onClick={() => {
              setStep(1);
              setError("");
            }}
          >
            <ArrowLeft size={15} />
            Back
          </Button>
        )}

        {step === 1 ? (
          <Button variant="brutal" size="lg" onClick={nextStep}>
            Select & continue
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button variant="brutal" size="lg" disabled>
            Content — next task
            <ArrowRight size={16} />
          </Button>
        )}
      </footer>

      {step === 2 && (
        <p className="text-center text-xs text-muted-foreground">
          Content, Review, and Publish will be implemented in the next tasks.
        </p>
      )}
    </Page>
  );
}
