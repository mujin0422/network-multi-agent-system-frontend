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
  const counts = hasData && metric.numerator != null && metric.sampleSize != null
    ? {
        positive: metric.numerator.toLocaleString(),
        negative: Math.max(0, metric.sampleSize - metric.numerator).toLocaleString(),
      }
    : null
  const positiveValue = !hasData ? "—" : counts?.positive ?? `${value.toFixed(1)}%`
  const negativeValue = !hasData ? "—" : counts?.negative ?? `${(100 - value).toFixed(1)}%`
  const sample = metric.sampleSize == null ? "unavailable" : `n = ${metric.sampleSize.toLocaleString()}`


  return (
    <div
      className="flex min-w-[166px] flex-1 flex-col items-center rounded-xl border border-border/60 bg-muted/15 px-3 py-4 text-center"
      title={metric.scope}
    >
      <div
        className="relative size-28 shrink-0"
        role="img"
        aria-label={`${metric.label}: ${hasData ? textValue : "not available"}. ${metric.positiveLabel}: ${positiveValue}; ${metric.negativeLabel}: ${negativeValue}. ${sample}. ${metric.scope}.`}
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
              <Cell fill={hasData ? metric.secondaryColor : TRACK_COLOR} />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold tracking-tight tabular-nums text-foreground">
            {textValue}
          </span>
        </div>
      </div>
      <p className="mt-3 min-h-10 text-[13px] font-semibold leading-tight text-foreground">
        {metric.label}
      </p>
      <p className="mt-1 min-h-8 text-[11px] leading-tight text-muted-foreground">
        {metric.description}
      </p>
      <div className="mt-3 flex w-full flex-col gap-2 text-left" aria-hidden="true">
        {([
          { label: metric.positiveLabel, color: metric.color, count: positiveValue },
          { label: metric.negativeLabel, color: metric.secondaryColor, count: negativeValue },
        ] as const).map((item) => (
          <div key={item.label} className="flex min-w-0 items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
              {item.label}
            </span>
            <span className="shrink-0 text-[11px] font-semibold tabular-nums text-foreground">
              {item.count}
            </span>
          </div>
        ))}
      </div>
      {hasData && counts == null && metric.sampleSize != null && (
        <p className="mt-2 text-[10px] tabular-nums text-muted-foreground">{sample}</p>
      )}
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
          Each color indicates the measured outcome and its complement. TSR and finalization:
          all runs. GOAL, RCA and F1: latest 100 evaluations (v4 only). Cleanup:
          latest 100 runs. Hover a card for its source and scope.
        </p>
      </CardContent>
    </Card>
  )
}
