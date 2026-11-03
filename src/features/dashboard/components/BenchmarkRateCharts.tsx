import { Cell, Pie, PieChart } from "recharts"

import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardRateMetric } from "../utils/benchmark-rates.util"

const TRACK_COLOR = "var(--muted)"

function BenchmarkDonut({ metric }: { metric: DashboardRateMetric }) {
  const hasData = metric.value != null
  const value = hasData ? Math.max(0, Math.min(metric.value ?? 0, 100)) : 0
  const segments = [
    { name: "Measured", amount: value },
    { name: "Remaining", amount: 100 - value },
  ]

  const textValue = hasData ? `${value.toFixed(1)}%` : "—"
  const detail = metric.sampleSize == null
    ? "Unavailable"
    : metric.sampleSize === 0
      ? "No data yet"
      : metric.numerator == null
        ? `n = ${metric.sampleSize.toLocaleString()}`
        : `${metric.numerator.toLocaleString()} / ${metric.sampleSize.toLocaleString()}`

  return (
    <div
      className="flex min-w-[166px] flex-1 flex-col items-center rounded-xl border border-border/60 bg-muted/15 px-3 py-4 text-center"
      title={metric.scope}
    >
      <div
        className="relative size-28 shrink-0"
        role="img"
        aria-label={`${metric.label}: ${hasData ? textValue : "not available"}. ${detail}. ${metric.scope}.`}
      >
        <ChartContainer
          config={{ measured: { label: metric.label, color: metric.color } }}
          className="aspect-square size-28"
        >
          <PieChart>
            <Pie
              data={segments}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={39}
              outerRadius={52}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={hasData ? metric.color : TRACK_COLOR} />
              <Cell fill={TRACK_COLOR} />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold tracking-tight tabular-nums text-foreground">
            {textValue}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {hasData ? "Rate" : "N/A"}
          </span>
        </div>
      </div>
      <p className="mt-3 min-h-10 text-[13px] font-semibold leading-tight text-foreground">
        {metric.label}
      </p>
      <p className="mt-1 min-h-8 text-[11px] leading-tight text-muted-foreground">
        {metric.description}
      </p>
      <p
        className="mt-3 rounded-full px-2 py-1 text-[11px] font-semibold tabular-nums"
        style={{ color: metric.color, backgroundColor: `${metric.color}18` }}
      >
        {detail}
      </p>
    </div>
  )
}

/** One full-width KPI panel, with a single horizontal row and mobile scroll. */
export function BenchmarkRateCharts({
  metrics,
  error,
}: {
  metrics: DashboardRateMetric[]
  error: string | null
}) {
  return (
    <Card className="gap-0 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
      <CardHeader className="gap-1 px-4">
        <CardTitle className="type-caption text-foreground">
          Benchmark Evaluation KPIs
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Pass rates and diagnostic quality · v4 scores are kept separate from legacy evaluations
        </p>
        {error && <p className="text-xs text-amber-400" role="status">{error}</p>}
      </CardHeader>
      <CardContent className="mt-4 min-w-0 px-4">
        <div className="flex w-full gap-3 overflow-x-auto pb-2">
          {metrics.map((metric) => (
            <BenchmarkDonut key={metric.id} metric={metric} />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          TSR and finalization: all runs. Goal, RCA and F1: latest 100 evaluations (v4 only).
          Cleanup: latest 100 runs. Hover a card for its source and scope.
        </p>
      </CardContent>
    </Card>
  )
}
