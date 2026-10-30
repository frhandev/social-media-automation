import {
  BarChart3,
  CalendarDays,
  Clapperboard,
  Layers3,
  Send,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    title: "Multi-platform content",
    description:
      "Prepare platform-specific titles, captions, hashtags, and calls to action from a single content workflow.",
    icon: Layers3,
    label: "Content workflow",
  },
  {
    title: "Content calendar",
    description:
      "Explore scheduled content through interactive month and week views, with clear daily agendas.",
    icon: CalendarDays,
    label: "Planning",
  },
  {
    title: "Media library",
    description:
      "Browse and organize creative assets, including images and videos used in your content.",
    icon: Clapperboard,
    label: "Organization",
  },
  {
    title: "Publishing tracking",
    description:
      "Review sample publishing statuses, failed attempts, and per-platform publication records.",
    icon: Send,
    label: "Demo records",
  },
  {
    title: "Performance analytics",
    description:
      "Explore illustrative views, engagement trends, and platform comparisons through interactive charts.",
    icon: BarChart3,
    label: "Demo insights",
  },
  {
    title: "AI assistance",
    description:
      "Planned AI-powered support for drafting and adapting content. This capability is not implemented yet.",
    icon: Sparkles,
    label: "Planned feature",
  },
] as const;

export default function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-24 border-b border-border px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)] lg:items-end">
          <div>
            <p className="eyebrow mb-3">BUILT FOR THE CREATIVE PROCESS</p>

            <h2
              id="features-title"
              className="max-w-2xl font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight sm:text-5xl"
            >
              Everything in
              <br />
              one flow.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted-foreground lg:justify-self-end">
            From the first content idea to performance review, SocialFlow AI
            brings the workflow together in one organized experience.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const highlighted = index === 0;

            return (
              <article
                key={feature.title}
                className={`group flex min-h-66 min-w-0 flex-col justify-between rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-brutal-xs motion-reduce:transform-none motion-reduce:transition-none sm:p-7 ${
                  highlighted
                    ? "border-ink bg-brand/25 shadow-brutal-sm"
                    : "border-border bg-card hover:border-ink"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex size-12 items-center justify-center rounded-lg border ${
                        highlighted
                          ? "border-ink bg-brand"
                          : "border-border bg-secondary"
                      }`}
                    >
                      <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                    </div>

                    <span className="font-mono text-xs text-subtle">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 font-display text-xl font-bold leading-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-7 border-t border-ink/10 pt-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.13em] ${
                      feature.label === "Planned feature"
                        ? "text-brand-2"
                        : "text-muted-foreground"
                    }`}
                  >
                    {feature.label}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
