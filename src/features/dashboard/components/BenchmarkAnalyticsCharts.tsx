import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import type {
  BenchmarkAnalytics,
  BenchmarkTrendPoint,
  RcaQualityPoint,
} from "../utils/benchmark-analytics.util"

const trendConfig = {
  goalRate: { label: "GOAL Pass", color: "#0891b2" },
  rcaRate: { label: "RCA Pass", color: "#7c3aed" },
  rcaF1: { label: "Average RCA F1", color: "#d97706" },
} satisfies ChartConfig

const qualityConfig = {
  value: { label: "Mean score", color: "#0891b2" },
} satisfies ChartConfig

const percentage = (value: number | null) =>
  value == null ? "—" : value.toFixed(1) + "%"

type TrendTooltipProps = {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: BenchmarkTrendPoint }>
}

function PerformanceTooltip({ active, payload }: TrendTooltipProps) {
  if (!active) return null
  const point = payload?.[0]?.payload
  if (!point) return null

  const rows = [
    { label: "GOAL Pass", color: "#0891b2", value: point.goalRate, count: point.goalScored },
    { label: "RCA Pass", color: "#7c3aed", value: point.rcaRate, count: point.rcaScored },
    { label: "Average RCA F1", color: "#d97706", value: point.rcaF1, count: point.f1Scored },
  ]

  return (
    <div className="min-w-48 rounded-lg border border-border/60 bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg">
      <p className="mb-1 font-semibold">{point.label}</p>
      <p className="mb-2 text-muted-foreground">{point.sampleSize} completed v4 evaluations</p>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2 py-1">
          <span className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: row.color }} />
          <span className="flex-1 text-muted-foreground">{row.label}</span>
          <span className="font-semibold tabular-nums">{percentage(row.value)}</span>
          <span className="w-8 text-right text-muted-foreground tabular-nums">
            {"n=" + row.count}
          </span>
        </div>
      ))}
    </div>
  )
}

type QualityTooltipProps = {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: RcaQualityPoint }>
}

function QualityTooltip({ active, payload }: QualityTooltipProps) {
  if (!active) return null
  const point = payload?.[0]?.payload
  if (!point) return null

  return (
    <div className="rounded-lg border border-border/60 bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg">
      <p className="font-semibold">{point.label}</p>
      <p className="mt-1">{percentage(point.value)} average</p>
      <p className="mt-1 text-muted-foreground">{point.sampleSize} scored v4 evaluations</p>
    </div>
  )
}

function BenchmarkPerformanceTrend({
  analytics,
  error,
}: {
  analytics: BenchmarkAnalytics
  error: string | null
}) {
  const [period, setPeriod] = useState<7 | 30>(7)
  const points = period === 7 ? analytics.trend7 : analytics.trend30
  const hasScores = points.some(
    (point) => point.goalRate != null || point.rcaRate != null || point.rcaF1 != null,
  )
  const xTicks = period === 30
    ? points
        .filter((_, index) => index % 5 === 0 || index === points.length - 1)
        .map((point) => point.label)
    : undefined

  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 px-4">
        <div className="space-y-1">
          <CardTitle className="type-caption text-foreground">Benchmark Performance Trend</CardTitle>
          <p className="type-caption text-muted-foreground">
            Daily GOAL / RCA pass rates and mean RCA F1 · last {period} days
          </p>
        </div>
        <div
          role="group"
          aria-label="Benchmark performance time range"
          className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5"
        >
          {([7, 30] as const).map((days) => (
            <Button
              key={days}
              type="button"
              size="sm"
              variant={period === days ? "secondary" : "ghost"}
              aria-pressed={period === days}
              className="h-7 rounded-md px-2.5 text-xs"
              onClick={() => setPeriod(days)}
            >
              {days} Days
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="mt-4 px-4">
        {error ? (
          <div role="status" className="flex h-64 items-center justify-center text-center text-xs text-muted-foreground">
            Evaluation data unavailable. Unable to plot benchmark history.
          </div>
        ) : !hasScores ? (
          <div className="flex h-64 items-center justify-center text-center text-xs text-muted-foreground">
            No scored v4 evaluations in the selected period.
          </div>
        ) : (
          <ChartContainer config={trendConfig} className="h-64 w-full aspect-auto">
            <LineChart data={points} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" ticks={xTicks} tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} width={37} tickFormatter={(value: number) => value + "%"} />
              <ChartTooltip cursor={{ strokeDasharray: "3 3" }} filterNull={false} content={<PerformanceTooltip />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="linear" dataKey="goalRate" stroke="var(--color-goalRate)" strokeWidth={2} dot={{ r: 2, strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
              <Line type="linear" dataKey="rcaRate" stroke="var(--color-rcaRate)" strokeWidth={2} dot={{ r: 2, strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
              <Line type="linear" dataKey="rcaF1" stroke="var(--color-rcaF1)" strokeWidth={2} dot={{ r: 2, strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
            </LineChart>
          </ChartContainer>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Based on the latest {analytics.fetchedCount} evaluations returned by the API (maximum 100);
          { " " }{analytics.v4CompletedCount} completed v4. Dates use evaluation completion time;
          missing data is not treated as 0%. This is not an all-history trend.
        </p>
      </CardContent>
    </Card>
  )
}

function RcaQualityBreakdown({
  analytics,
  error,
}: {
  analytics: BenchmarkAnalytics
  error: string | null
}) {
  const hasScores = analytics.quality.some((metric) => metric.value != null)
  const missing = analytics.quality.filter((metric) => metric.value == null).map((metric) => metric.label)
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
      <CardHeader className="px-4">
        <CardTitle className="type-caption text-foreground">RCA Quality Breakdown</CardTitle>
        <p className="type-caption text-muted-foreground">
          Mean structured RCA scores · completed v4 evaluations
        </p>
      </CardHeader>
      <CardContent className="mt-4 px-4">
        {error ? (
          <div role="status" className="flex h-64 items-center justify-center text-center text-xs text-muted-foreground">
            Evaluation data unavailable. Unable to compare RCA scores.
          </div>
        ) : !hasScores ? (
          <div className="flex h-64 items-center justify-center text-center text-xs text-muted-foreground">
            No valid RCA scores in the latest evaluation sample.
          </div>
        ) : (
          <ChartContainer config={qualityConfig} className="h-64 w-full aspect-auto">
            <BarChart data={analytics.quality} layout="vertical" accessibilityLayer margin={{ top: 4, right: 14, bottom: 4, left: 4 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tickFormatter={(value: number) => value + "%"} />
              <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={102} tick={{ fontSize: 11 }} />
              <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<QualityTooltip />} />
              <Bar dataKey="value" name="Average score" barSize={14} radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {analytics.quality.map((metric) => (
                  <Cell key={metric.key} fill={metric.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Mean of available scores only, within the latest {analytics.fetchedCount} evaluations
          (API cap 100; {analytics.v4CompletedCount} completed v4). Hover bars for sample size.
          {missing.length > 0 && !error && hasScores && (
            <span> Unavailable: {missing.join(", ")}. Missing scores are not zeros.</span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}

/** Two analysis panels reusing the single existing evaluations request. */
export function BenchmarkAnalyticsCharts({
  analytics,
  error,
}: {
  analytics: BenchmarkAnalytics
  error: string | null
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <BenchmarkPerformanceTrend analytics={analytics} error={error} />
      <RcaQualityBreakdown analytics={analytics} error={error} />
    </section>
  )
}
