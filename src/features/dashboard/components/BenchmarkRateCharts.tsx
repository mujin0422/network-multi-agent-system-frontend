import { Cell, Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardRateMetric } from "../utils/benchmark-rates.util"

const TRACK_COLOR = "var(--muted)"

type DonutTooltipProps = {
  active?: boolean
  metric: DashboardRateMetric
  hasData: boolean
  positiveValue: string
  negativeValue: string
}

/** Recharts tooltip: show both slices regardless of which arc is hovered. */
function DonutBreakdownTooltip({
  active,
  metric,
  hasData,
  positiveValue,
  negativeValue,
}: DonutTooltipProps) {
  if (!active) return null

  return (
    <div className="min-w-44 rounded-lg border border-border/70 bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg">
      <p className="mb-2 font-semibold">{metric.label}</p>
      {([
        { label: metric.positiveLabel, color: metric.color, value: positiveValue },
        { label: metric.negativeLabel, color: metric.secondaryColor, value: negativeValue },
      ] as const).map((item) => (
        <div key={item.label} className="flex items-center gap-2 py-1">
          <span
            className="size-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: hasData ? item.color : TRACK_COLOR }}
          />
          <span className="flex-1 whitespace-nowrap text-muted-foreground">{item.label}</span>
          <span className="font-semibold tabular-nums">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

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
              innerRadius={43}
              outerRadius={52}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={hasData ? metric.color : TRACK_COLOR} />
              <Cell fill={hasData ? metric.secondaryColor : TRACK_COLOR} />
            </Pie>
            <ChartTooltip
              cursor={false}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 50 }}
              content={
                <DonutBreakdownTooltip
                  metric={metric}
                  hasData={hasData}
                  positiveValue={positiveValue}
                  negativeValue={negativeValue}
                />
              }
            />
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[13px] font-bold tracking-tight tabular-nums text-foreground">
            {textValue}
          </span>
        </div>
      </div>
      <p className="mt-3 flex min-h-10 items-center justify-center text-[13px] font-semibold leading-tight text-foreground">
        {metric.label}
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
        <div className="flex w-full gap-3 overflow-x-auto pb-2 xl:overflow-visible">
          {metrics.map((metric) => (
            <BenchmarkDonut key={metric.id} metric={metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
