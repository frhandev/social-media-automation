"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  ChevronRight,
  LoaderCircle,
  Save,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PLATFORMS, PlatformBadge } from "@/components/layout/PlatformBadge";
import { StatusBadge } from "@/components/layout/StatusBadge";
import MediaCard from "@/components/Media/MediaCard";
import { Button } from "@/components/ui/button";
import {
  Field,
  MediaFacts,
  MediaThumb,
  Modal,
  Page,
  SectionTitle,
  Tabs,
} from "@/components/shared";
import { mediaItems, platformAccounts } from "@/lib/mock-data";
import { formatDate, scheduleISO } from "@/lib/helperFunctions";
import { saveDemoPost, type DemoPost } from "@/lib/demo-posts";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types/platform/Platform";
import type { Content } from "@/types/post/Content";
import type { PostLifecycle } from "@/types/post/PostLifecycle";

const STEPS = ["Media", "Platforms", "Content", "Review", "Publish"] as const;
const TIMEZONE = "Europe/Istanbul" as const;
const EMPTY_CONTENT: Content = { title: "", body: "", tags: "", cta: "" };

function mockSuggestion(
  platform: Platform,
  current: Content,
  action: string,
): Partial<Content> {
  switch (action) {
    case "Generate example":
      return {
        title:
          platform === "youtube"
            ? "Build Better Backends with ASP.NET Core"
            : "3 backend tips worth saving",
        body:
          platform === "youtube"
            ? "A practical introduction to building maintainable ASP.NET Core apps. Explore separation of concerns, dependency injection, and API structure."
            : "Three simple habits that make backend projects easier to maintain. Which one do you use?",
        tags:
          platform === "youtube"
            ? "C#, ASP.NET Core, Backend"
            : "#coding #backend #developer",
        cta: "Save this for your next project.",
      };
    case "Improve hook":
      return platform === "instagram"
        ? { body: `Stop making this mistake.\n\n${current.body}`.trim() }
        : { title: "The backend tip I wish I knew earlier" };
    case "Shorten":
      return {
        body:
          current.body.length > 140
            ? `${current.body.slice(0, 137).trimEnd()}…`
            : current.body,
      };
    case "Generate hashtags":
      return {
        tags:
          platform === "youtube"
            ? "C#, Software Engineering, APIs"
            : "#coding #developer #buildinpublic",
      };
    default:
      return {};
  }
}

export default function PostComposer() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mediaId, setMediaId] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [tab, setTab] = useState<Platform>("youtube");
  const [contents, setContents] = useState<Partial<Record<Platform, Content>>>(
    {},
  );
  const [mode, setMode] = useState<"now" | "schedule">("schedule");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const media = mediaItems.find((item) => item.id === mediaId);
  const active = platforms.includes(tab) ? tab : platforms[0];
  const activeContent = active
    ? (contents[active] ?? EMPTY_CONTENT)
    : EMPTY_CONTENT;
  const selectedDate = scheduleISO(date, time);

  function patchContent(patch: Partial<Content>, platform = active) {
    if (!platform) return;
    setContents((previous) => ({
      ...previous,
      [platform]: { ...(previous[platform] ?? EMPTY_CONTENT), ...patch },
    }));
  }

  function togglePlatform(platform: Platform) {
    setPlatforms((previous) =>
      previous.includes(platform)
        ? previous.filter((p) => p !== platform)
        : [...previous, platform],
    );
  }

  function validate(upto: number): string | null {
    if (upto >= 1 && media?.status !== "ready")
      return "Select a ready media asset before continuing.";
    if (upto >= 2 && platforms.length === 0)
      return "Select at least one connected platform.";
    if (
      upto >= 2 &&
      platforms.some(
        (p) => !platformAccounts.find((a) => a.platform === p)?.connected,
      )
    ) {
      return "One selected platform is not connected.";
    }
    if (upto >= 3) {
      for (const p of platforms) {
        const content = contents[p] ?? EMPTY_CONTENT;
        if (
          !content.body.trim() ||
          (p !== "instagram" && !content.title.trim())
        ) {
          return `Add ${p === "instagram" ? "a caption" : "a title and caption"} for ${PLATFORMS[p].label}.`;
        }
      }
    }
    if (upto >= 5 && mode === "schedule") {
      if (!selectedDate || Date.parse(selectedDate) <= Date.now()) {
        return "Choose a valid future publishing date and time (Europe/Istanbul).";
      }
    }
    return null;
  }

  function nextStep() {
    const issue = validate(step === 4 ? 3 : step);
    if (issue) return setError(issue);
    setError("");
    if (step === 5) {
      const lastIssue = validate(5);
      if (lastIssue) return setError(lastIssue);
      setConfirm(true);
    } else {
      setStep((s) => Math.min(s + 1, 5));
    }
  }

  function makePost(status: "draft" | "scheduled" | "queued"): DemoPost {
    const first = contents[platforms[0]] ?? EMPTY_CONTENT;
    const title =
      first.title.trim() ||
      first.body.trim().slice(0, 70) ||
      media?.filename ||
      "Untitled draft";
    return {
      id: `demo-${crypto.randomUUID()}`,
      title,
      excerpt: first.body,
      mediaId,
      platforms,
      createdAt: new Date().toISOString(),
      scheduledAt:
        status === "scheduled" ? (selectedDate ?? undefined) : undefined,
      status,
      timezone: TIMEZONE,
      content: contents,
      publications: platforms.map((platform) => ({
        platform: {
          platform,
          connected:
            platformAccounts.find((a) => a.platform === platform)?.connected ??
            false,
          handle: platformAccounts.find((a) => a.platform === platform)
            ?.account,
        },
        status: status as PostLifecycle,
        attempts: [],
      })),
    };
  }

  function save(status: "draft" | "scheduled" | "queued") {
    if (busy) return;
    setBusy(true);
    try {
      if (status !== "draft") {
        const issue = validate(5);
        if (issue) {
          setError(issue);
          setConfirm(false);
          return;
        }
      }
      const post = makePost(status);
      saveDemoPost(post);
      setConfirm(false);
      router.push(`/posts/${post.id}`);
    } catch {
      setError(
        "Could not save this demo post in browser storage. Check storage permissions.",
      );
      setConfirm(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Create content"
        title="Create post"
        description="One idea. Your voice. Every channel. This editor uses local demo data."
        action={
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => save("draft")}
          >
            <Save size={16} /> Save draft
          </Button>
        }
      />

      <nav className="wizard-steps" aria-label="Create post steps">
        {STEPS.map((label, index) => {
          const number = index + 1;
          return (
            <button
              key={label}
              type="button"
              className={cn(
                "wizard-step",
                step === number && "active",
                step > number && "complete",
              )}
              disabled={number > step || busy}
              aria-current={step === number ? "step" : undefined}
              onClick={() => {
                setStep(number);
                setError("");
              }}
            >
              <span>{step > number ? <Check size={15} /> : `0${number}`}</span>
              {label}
            </button>
          );
        })}
      </nav>

      {step === 1 && (
        <div className="editor-layout">
          <section>
            <SectionTitle>Start with the visual</SectionTitle>
            <div className="search-field mb-5">
              <Search size={16} />
              <input
                aria-label="Search media"
                placeholder="Search media library…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="media-picker-grid grid grid-cols-1 gap-4 sm:grid-cols-2">
              {mediaItems
                .filter((m) =>
                  m.filename.toLowerCase().includes(search.toLowerCase()),
                )
                .map((m) => (
                  <MediaCard
                    key={m.id}
                    media={m}
                    selectable
                    selected={mediaId === m.id}
                    onClick={() => {
                      setMediaId(m.id);
                      setError("");
                    }}
                  />
                ))}
            </div>
            <p className="mt-5 text-xs leading-6 text-muted-foreground">
              Select an existing ready asset. File upload is not implemented
              yet.{" "}
              <Link href="/media" className="font-semibold underline">
                Open Media Library
              </Link>
            </p>
          </section>
          <aside>
            <SectionTitle>Selected media</SectionTitle>
            {media ? (
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <MediaThumb media={media} playback />
                <div className="space-y-4 p-5">
                  <p className="break-all text-sm font-semibold">
                    {media.filename}
                  </p>
                  <StatusBadge status={media.status} />
                  <MediaFacts media={media} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMediaId("")}
                  >
                    Remove selection
                  </Button>
                </div>
              </div>
            ) : (
              <div className="empty-state min-h-64">
                <p className="font-display text-lg font-semibold">
                  Choose your media
                </p>
                <p>Your selected image or video will be used for this post.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      {step === 2 && (
        <section>
          <SectionTitle>Where should this go?</SectionTitle>
          <p className="mb-6 text-sm text-muted-foreground">
            Select the connected channels for your post.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {platformAccounts.map((account) => {
              const checked = platforms.includes(account.platform);
              return (
                <div
                  key={account.platform}
                  className={cn("choice", checked && "selected")}
                >
                  <div className="mb-4">
                    <PlatformBadge platform={account.platform} />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold">
                    {PLATFORMS[account.platform].label}
                  </h3>
                  <p className="mb-5 text-xs text-subtle">
                    {account.account || "No account linked"}
                  </p>
                  <StatusBadge
                    status={account.connected ? "connected" : "not_connected"}
                  />
                  {account.connected ? (
                    <button
                      type="button"
                      className="absolute inset-0 rounded-lg"
                      aria-pressed={checked}
                      aria-label={`Select ${PLATFORMS[account.platform].label}`}
                      onClick={() => togglePlatform(account.platform)}
                    >
                      <span className="choice-check">
                        {checked && <Check size={13} />}
                      </span>
                    </button>
                  ) : (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Unavailable in the current mock workspace.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {step === 3 && active && (
        <div className="space-y-6">
          <Tabs
            items={platforms.map((p) => PLATFORMS[p].label)}
            value={PLATFORMS[active].label}
            onChange={(label) => {
              const platform = platforms.find(
                (p) => PLATFORMS[p].label === label,
              );
              if (platform) setTab(platform);
            }}
            label="Platform content"
          />
          <div className="editor-layout">
            <section className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Make it sound like you.
                  </h2>
                  <p className="mt-2 text-xs text-subtle">
                    Customize the post for {PLATFORMS[active].label}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    patchContent(
                      mockSuggestion(active, activeContent, "Generate example"),
                    )
                  }
                >
                  <Sparkles size={14} /> Fill demo example
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 border-b border-border pb-5">
                {(
                  ["Improve hook", "Shorten", "Generate hashtags"] as const
                ).map((action) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    key={action}
                    onClick={() =>
                      patchContent(
                        mockSuggestion(active, activeContent, action),
                      )
                    }
                  >
                    {action}
                  </Button>
                ))}
              </div>
              {active !== "instagram" && (
                <Field
                  label={active === "youtube" ? "Title" : "Hook"}
                  hint={`${activeContent.title.length}/${active === "youtube" ? 100 : 150} characters`}
                >
                  <input
                    className="form-control"
                    value={activeContent.title}
                    maxLength={active === "youtube" ? 100 : 150}
                    onChange={(e) => patchContent({ title: e.target.value })}
                    placeholder="Give your content a memorable title"
                  />
                </Field>
              )}
              <Field
                label={active === "youtube" ? "Description" : "Caption"}
                hint={`${activeContent.body.length}/${active === "youtube" ? 5000 : 2200} characters`}
              >
                <textarea
                  className="form-control min-h-48"
                  maxLength={active === "youtube" ? 5000 : 2200}
                  value={activeContent.body}
                  onChange={(e) => patchContent({ body: e.target.value })}
                  placeholder="What's the story behind this post?"
                />
              </Field>
              <Field label={active === "youtube" ? "Tags" : "Hashtags"}>
                <input
                  className="form-control"
                  maxLength={500}
                  value={activeContent.tags}
                  onChange={(e) => patchContent({ tags: e.target.value })}
                  placeholder="#content #creator"
                />
              </Field>
              <Field label="Call to action (optional)">
                <input
                  className="form-control"
                  maxLength={150}
                  value={activeContent.cta}
                  onChange={(e) => patchContent({ cta: e.target.value })}
                  placeholder="Save this for later"
                />
              </Field>
              <p className="text-xs text-muted-foreground">
                AI-style suggestions are static examples; no AI service is
                connected.
              </p>
            </section>
            <aside>
              <SectionTitle>Live preview</SectionTitle>
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="p-4">
                  <PlatformBadge platform={active} />
                </div>
                <MediaThumb media={media} />
                <div className="space-y-3 p-5">
                  {activeContent.title && (
                    <h3 className="font-display text-lg font-semibold">
                      {activeContent.title}
                    </h3>
                  )}
                  <p className="whitespace-pre-wrap wrap-break-word text-xs leading-6 text-muted-foreground">
                    {activeContent.body ||
                      "Your platform-specific caption appears here."}
                  </p>
                  {activeContent.cta && (
                    <p className="text-xs font-semibold">{activeContent.cta}</p>
                  )}
                  <p className="wrap-break-word text-xs text-brand-2">
                    {activeContent.tags}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {step === 4 && (
        <section>
          <SectionTitle>One last look</SectionTitle>
          <div className="review-row">
            <p className="eyebrow">Media</p>
            <div className="flex min-w-0 items-center gap-4">
              <MediaThumb media={media} compact />
              <p className="truncate text-sm font-semibold">
                {media?.filename}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              Edit
            </Button>
          </div>
          <div className="review-row">
            <p className="eyebrow">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              Edit
            </Button>
          </div>
          <div className="review-row">
            <p className="eyebrow">Content</p>
            <div className="space-y-5">
              {platforms.map((p) => (
                <div key={p}>
                  <PlatformBadge platform={p} />
                  <h3 className="mt-3 text-sm font-semibold">
                    {contents[p]?.title || "Untitled"}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap wrap-break-word text-xs text-muted-foreground">
                    {contents[p]?.body}
                  </p>
                  <p className="mt-2 text-xs text-brand-2">
                    {contents[p]?.tags}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
              Edit
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Scheduling options are selected in the final step.
          </p>
        </section>
      )}

      {step === 5 && (
        <div className="editor-layout">
          <section className="space-y-6">
            <SectionTitle>Find your moment</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["now", "schedule"] as const).map((choice) => (
                <button
                  key={choice}
                  type="button"
                  aria-pressed={mode === choice}
                  className={cn("choice", mode === choice && "selected")}
                  onClick={() => setMode(choice)}
                >
                  {choice === "now" ? (
                    <Send size={24} />
                  ) : (
                    <CalendarClock size={24} />
                  )}
                  <span className="choice-check">
                    {mode === choice && <Check size={13} />}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">
                    {choice === "now" ? "QUEUE (DEMO)" : "SCHEDULE (DEMO)"}
                  </h3>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground">
                    {choice === "now"
                      ? "Add this post to the local demo queue."
                      : "Set a future time in Europe/Istanbul."}
                  </p>
                </button>
              ))}
            </div>
            {mode === "schedule" && (
              <div className="panel space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Date">
                    <input
                      className="form-control"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Field>
                  <Field label="Time">
                    <input
                      className="form-control"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </Field>
                </div>
                <p className="text-xs text-muted-foreground">
                  Timezone: {TIMEZONE}. No background publishing task is
                  started.
                </p>
              </div>
            )}
          </section>
          <aside className="self-start rounded-lg border border-border bg-card p-6">
            <p className="eyebrow mb-5">YOUR POST AT A GLANCE</p>
            <MediaThumb media={media} />
            <h3 className="mb-3 mt-5 font-display text-xl font-bold">
              {contents[platforms[0]]?.title ||
                contents[platforms[0]]?.body?.slice(0, 55) ||
                "Your next post"}
            </h3>
            <div className="mb-5 flex flex-wrap gap-2">
              {platforms.map((p) => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
            <p className="border-t border-border pt-4 text-xs leading-6 text-muted-foreground">
              {mode === "schedule" && selectedDate
                ? formatDate(selectedDate, true, true)
                : "No scheduled date"}
              <br />
              Demo only — no content is sent to YouTube, TikTok, or Instagram.
            </p>
          </aside>
        </div>
      )}

      {error && (
        <p className="error-note" role="alert">
          {error}
        </p>
      )}
      <footer className="wizard-footer">
        <Button
          variant="ghost"
          disabled={busy}
          onClick={() => {
            if (step === 1) router.push("/posts");
            else setStep((s) => s - 1);
            setError("");
          }}
        >
          <ArrowLeft size={15} /> {step === 1 ? "All posts" : "Back"}
        </Button>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-subtle sm:block">
            Step {step} of 5
          </span>
          <Button variant="brutal" size="lg" disabled={busy} onClick={nextStep}>
            {step === 5
              ? mode === "schedule"
                ? "Schedule demo"
                : "Queue demo"
              : "Continue"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </footer>

      <Modal
        open={confirm}
        onOpenChange={(open) => {
          if (!busy) setConfirm(open);
        }}
        title={mode === "schedule" ? "Save demo schedule?" : "Queue demo post?"}
        description="This is a local simulation. It will not publish to social accounts."
      >
        <p className="text-sm text-muted-foreground">
          The post will be visible in Posts and Post Details in this browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {platforms.map((p) => (
            <PlatformBadge key={p} platform={p} />
          ))}
        </div>
        {mode === "schedule" && (
          <p className="mt-4 font-semibold">
            {formatDate(selectedDate ?? undefined, true, true)} · {TIMEZONE}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => setConfirm(false)}
          >
            Back
          </Button>
          <Button
            variant="brutal"
            disabled={busy}
            onClick={() => save(mode === "schedule" ? "scheduled" : "queued")}
          >
            {busy ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <ChevronRight size={15} />
            )}
            Confirm demo
          </Button>
        </div>
      </Modal>
    </Page>
  );
}
