"use client";

import { PLATFORMS } from "@/components/layout/PlatformBadge";
import { Field, SectionTitle, Tabs } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  validateAllPlatformContents,
  validatePlatformContent,
} from "@/lib/helperFunctions";
import { mediaItems } from "@/lib/mock-data";
import { ContentField } from "@/types/platform/ContentField";
import { Platform } from "@/types/platform/Platform";
import { PlatformContent } from "@/types/platform/PlatformContent";
import { TouchedFields } from "@/types/platform/TouchedFields";
import { Content } from "@/types/post/Content";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import PlatformContentPreview from "./PlatformContentPreview";

type Props = {
  platforms: Platform[];
  mediaId: string;
  contents: PlatformContent;
  onContentChange: (platform: Platform, fields: Partial<Content>) => void;
  showValidation: boolean;
};

const EMPTY_CONTENT: Content = {
  title: "",
  body: "",
  tags: "",
  cta: "",
};

function ContentStep({
  platforms,
  mediaId,
  contents,
  onContentChange,
  showValidation,
}: Props) {
  const [selectedTab, setSelectedTab] = useState<Platform>("youtube");

  const [touched, setTouched] = useState<TouchedFields>({});

  const [showAllErrors, setShowAllErrors] = useState(false);

  const shouldShowAllErrors = showAllErrors || showValidation;

  const activePlatform = platforms.includes(selectedTab)
    ? selectedTab
    : platforms[0];

  const media = mediaItems.find((m) => m.id === mediaId);

  if (!activePlatform) {
    return (
      <p className="text-sm text-muted-foreground">
        Select at least one platform to continue.
      </p>
    );
  }

  const content = contents[activePlatform] ?? EMPTY_CONTENT;

  const errors = validatePlatformContent(activePlatform, content);

  const allValid = validateAllPlatformContents(platforms, contents);

  const invalidPlatforms = platforms.filter((platform) => {
    const platformContent = contents[platform] ?? EMPTY_CONTENT;

    return (
      Object.keys(validatePlatformContent(platform, platformContent)).length > 0
    );
  });

  function markTouched(field: ContentField) {
    setTouched((previous) => ({
      ...previous,
      [activePlatform]: {
        ...previous[activePlatform],
        [field]: true,
      },
    }));
  }

  function getError(field: ContentField) {
    const shouldShow = shouldShowAllErrors || touched[activePlatform]?.[field];

    return shouldShow ? errors[field] : undefined;
  }

  function updateField(fields: Partial<Content>) {
    onContentChange(activePlatform, fields);
  }

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle>Customize your content</SectionTitle>

        <p className="text-sm text-muted-foreground">
          Write content tailored to each selected platform. Your changes are
          kept separately for every channel.
        </p>
      </div>

      <Tabs
        label="Platform content"
        items={platforms.map((platform) => PLATFORMS[platform].label)}
        value={PLATFORMS[activePlatform].label}
        onChange={(label) => {
          const platform = platforms.find((p) => PLATFORMS[p].label === label);

          if (platform) {
            setSelectedTab(platform);
          }
        }}
      />

      <div className="editor-layout">
        <section className="min-w-0 space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold">
              {PLATFORMS[activePlatform].label} Content
            </h2>

            <p className="mt-1 text-xs text-subtle">
              Customize the post for this platform.
            </p>
          </div>

          {activePlatform !== "instagram" && (
            <Field
              label={activePlatform === "youtube" ? "Title" : "Hook"}
              hint={`${content.title.length}/${
                activePlatform === "youtube" ? 100 : 150
              } characters`}
              error={getError("title")}
            >
              <input
                className="form-control"
                value={content.title}
                maxLength={activePlatform === "youtube" ? 100 : 150}
                aria-invalid={!!getError("title")}
                placeholder={
                  activePlatform === "youtube"
                    ? "Give your video a title"
                    : "Write an engaging video hook"
                }
                onChange={(event) =>
                  updateField({
                    title: event.target.value,
                  })
                }
                onBlur={() => markTouched("title")}
              />
            </Field>
          )}

          <Field
            label={activePlatform === "youtube" ? "Description" : "Caption"}
            hint={`${content.body.length}/${
              activePlatform === "youtube" ? 5000 : 2200
            } characters`}
            error={getError("body")}
          >
            <textarea
              className="form-control min-h-48"
              value={content.body}
              maxLength={activePlatform === "youtube" ? 5000 : 2200}
              aria-invalid={!!getError("body")}
              placeholder={
                activePlatform === "youtube"
                  ? "Describe your video..."
                  : "Write your caption..."
              }
              onChange={(event) =>
                updateField({
                  body: event.target.value,
                })
              }
              onBlur={() => markTouched("body")}
            />
          </Field>

          <Field
            label={activePlatform === "youtube" ? "Tags" : "Hashtags"}
            hint="Optional"
          >
            <input
              className="form-control"
              value={content.tags}
              maxLength={500}
              placeholder={
                activePlatform === "youtube"
                  ? "C#, Backend, Programming"
                  : "#coding #developer #tech"
              }
              onChange={(event) =>
                updateField({
                  tags: event.target.value,
                })
              }
            />
          </Field>

          {activePlatform === "instagram" && (
            <Field label="Call to action" hint="Optional">
              <input
                className="form-control"
                value={content.cta}
                maxLength={150}
                placeholder="Save this post for later."
                onChange={(event) =>
                  updateField({
                    cta: event.target.value,
                  })
                }
              />
            </Field>
          )}

          <div className="border-t border-border pt-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllErrors(true)}
            >
              Check content
            </Button>

            {shouldShowAllErrors && (
              <div role="status" className="mt-4 text-xs leading-6">
                {allValid ? (
                  <p className="flex items-center gap-2 text-success">
                    <CheckCircle2 size={15} />
                    All selected platforms have valid content. You can continue
                    to Review.
                  </p>
                ) : (
                  <div className="error-note">
                    <p className="font-semibold">
                      Complete the required fields for:
                    </p>

                    <p className="mt-1">
                      {invalidPlatforms
                        .map((platform) => PLATFORMS[platform].label)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <PlatformContentPreview
          platform={activePlatform}
          content={content}
          media={media}
        />
      </div>
    </div>
  );
}

export default ContentStep;
