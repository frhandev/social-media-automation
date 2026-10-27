"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { PlatformComparisonPoint } from "@/lib/analytics";

type Props = {
  data: PlatformComparisonPoint[];
  hasData: boolean;
};

export default function PlatformComparison({ data, hasData }: Props) {
  return (
    <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-6">
        <p className="eyebrow mb-2">CHANNEL PERFORMANCE</p>

        <h2 className="font-display text-xl font-bold">Platform comparison</h2>

        <p className="mt-2 text-xs text-muted-foreground">
          Total views by platform for the selected period.
        </p>
      </div>

      {!hasData ? (
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-border px-5 text-center">
          <p className="text-sm text-muted-foreground">
            No platform analytics available.
          </p>
        </div>
      ) : (
        <>
          <div className="h-72 min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  bottom: 0,
                  left: -15,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 4"
                />

                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                  }}
                />

                <YAxis
                  width={54}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: number) =>
                    Intl.NumberFormat("en-US", {
                      notation: "compact",
                    }).format(value)
                  }
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

                <Bar
                  dataKey="views"
                  name="Views"
                  fill="var(--brand-2)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={65}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground">
            Platforms without recorded analytics have no bar. The comparison
            uses successful publications only.
          </p>
        </>
      )}
    </section>
  );
}
