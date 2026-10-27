"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { EngagementPoint } from "@/lib/analytics";

type Props = {
  data: EngagementPoint[];
  hasData: boolean;
};

export default function EngagementChart({ data, hasData }: Props) {
  return (
    <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-6">
        <p className="eyebrow mb-2">AUDIENCE INTERACTIONS</p>

        <h2 className="font-display text-xl font-bold">Engagement over time</h2>

        <p className="mt-2 text-xs text-muted-foreground">
          Daily likes, comments, and available shares.
        </p>
      </div>

      {!hasData ? (
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-border px-5 text-center">
          <p className="text-sm text-muted-foreground">
            No engagement data for this period.
          </p>
        </div>
      ) : (
        <>
          <div className="h-72 min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 5,
                  bottom: 5,
                  left: -18,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 4"
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                  tickFormatter={(value: string) => value.slice(5)}
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                  }}
                />

                <YAxis
                  width={54}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                  formatter={(value) =>
                    typeof value === "number"
                      ? value.toLocaleString("en-US")
                      : "Not available"
                  }
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    paddingTop: 12,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="likes"
                  name="Likes"
                  stroke="var(--brand-2)"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />

                <Line
                  type="monotone"
                  dataKey="comments"
                  name="Comments"
                  stroke="var(--ink)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />

                <Line
                  type="monotone"
                  dataKey="shares"
                  name="Available shares"
                  stroke="var(--success)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
            Missing shares are not treated as measured zero values. A daily
            shares total can still be partial when some platforms do not report
            shares.
          </p>
        </>
      )}
    </section>
  );
}
