import {
  BarChart3,
  CalendarClock,
  FilePenLine,
  UploadCloud,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Upload",
    heading: "Bring your content.",
    description: "Start by selecting images or videos from your media library.",
    icon: UploadCloud,
  },
  {
    number: "02",
    title: "Customize",
    heading: "Make it platform-ready.",
    description:
      "Adapt titles, descriptions, hooks, captions, and hashtags for each channel.",
    icon: FilePenLine,
  },
  {
    number: "03",
    title: "Schedule",
    heading: "Choose the moment.",
    description:
      "Prepare immediate publishing or a future publishing time. Actual scheduling requires the backend.",
    icon: CalendarClock,
  },
  {
    number: "04",
    title: "Track",
    heading: "See what happened.",
    description:
      "Explore sample publishing history and analytics. Live results require platform integrations.",
    icon: BarChart3,
  },
] as const;

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="workflow-title"
      className="scroll-mt-24 border-b border-border bg-secondary/45 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-3">HOW IT WORKS</p>

            <h2
              id="workflow-title"
              className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl"
            >
              From idea
              <br />
              to impact.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            Four connected stages designed to make social content management
            more organized and predictable.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <li
                key={step.number}
                className="relative flex min-w-0 flex-col rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-9 flex items-start justify-between">
                  <span className="font-display text-5xl font-bold tracking-tight text-foreground/15">
                    {step.number}
                  </span>

                  <div className="flex size-12 items-center justify-center rounded-lg border border-ink bg-brand">
                    <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
                  </div>
                </div>

                <span className="eyebrow">{step.title}</span>

                <h3 className="mt-3 font-display text-lg font-bold">
                  {step.heading}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>

                <div aria-hidden="true" className="mt-auto flex gap-1 pt-8">
                  <span className="h-1 w-10 rounded-full bg-brand-2" />
                  <span className="h-1 w-4 rounded-full bg-border" />
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-7 flex items-start gap-3 rounded-lg border border-border bg-card px-5 py-4">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-2" />

          <p className="text-xs leading-6 text-muted-foreground">
            This is the target end-to-end workflow. Content preparation and
            preview interfaces are available in the demo. Real media storage,
            automated scheduling, publishing, and platform analytics require
            future backend integration.
          </p>
        </div>
      </div>
    </section>
  );
}
