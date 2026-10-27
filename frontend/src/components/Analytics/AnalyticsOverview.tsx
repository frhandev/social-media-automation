import type { ReactNode } from "react";

import { Eye, Heart, MessageCircle, Activity } from "lucide-react";

import type { AnalyticsOverviewData } from "@/lib/analytics";

type Props = {
  data: AnalyticsOverviewData;
  hasData: boolean;
};

type MetricProps = {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  emphasis?: boolean;
};

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function Metric({
  label,
  value,
  description,
  icon,
  emphasis = false,
}: MetricProps) {
  return (
    <article
      className={`min-w-0 rounded-lg border p-4 sm:p-5 ${
        emphasis ? "border-ink bg-brand" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </p>

        <span className="shrink-0">{icon}</span>
      </div>

      <p className="mt-6 font-display text-3xl font-bold tabular-nums sm:text-4xl">
        {value}
      </p>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

export default function AnalyticsOverview({ data, hasData }: Props) {
  const rate =
    data.engagementRate === null ? "—" : `${data.engagementRate.toFixed(1)}%`;

  const label = "Illustrative mock value";

  return (
    <section aria-label="Analytics overview" className="space-y-3">
      <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total views"
          value={hasData ? compactNumber.format(data.views) : "—"}
          description={label}
          icon={<Eye size={19} />}
          emphasis
        />

        <Metric
          label="Total likes"
          value={hasData ? compactNumber.format(data.likes) : "—"}
          description={label}
          icon={<Heart size={19} />}
        />

        <Metric
          label="Comments"
          value={hasData ? compactNumber.format(data.comments) : "—"}
          description={label}
          icon={<MessageCircle size={19} />}
        />

        <Metric
          label="Engagement rate"
          value={hasData ? rate : "—"}
          description="Based on available engagement data"
          icon={<Activity size={19} />}
        />
      </div>

      {hasData && data.missingSharesRecords > 0 && (
        <p className="text-xs leading-6 text-muted-foreground">
          Shares are unavailable for {data.missingSharesRecords} daily
          record(s). Engagement totals and rates use available shares only and
          may be understated.
        </p>
      )}
    </section>
  );
}
