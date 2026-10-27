"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ViewsPoint } from "@/lib/analytics";

type Props = {
  data: ViewsPoint[];
  hasData: boolean;
};

export default function ViewsChart({ data, hasData }: Props) {
  return (
    <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-6">
        <p className="eyebrow mb-2">AUDIENCE REACH</p>

        <h2 className="font-display text-xl font-bold">Views over time</h2>

        <p className="mt-2 text-xs text-muted-foreground">
          Daily views across selected publications.
        </p>
      </div>

      {!hasData ? (
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-border px-5 text-center">
          <p className="text-sm text-muted-foreground">
            No analytics data for this period.
          </p>
        </div>
      ) : (
        <div className="h-72 min-w-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 5,
                bottom: 0,
                left: -18,
              }}
            >
              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="3 4"
                vertical={false}
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
                tickLine={false}
                axisLine={false}
                width={54}
                tick={{
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                }}
                tickFormatter={(value: number) =>
                  Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(value)
                }
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
                    : "—"
                }
              />

              <Area
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="var(--brand-2)"
                strokeWidth={2.5}
                fill="var(--brand-2)"
                fillOpacity={0.12}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
