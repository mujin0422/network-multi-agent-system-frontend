import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type {
  ExecutionTimePoint,
  TaskOutcomePoint,
} from "../types/task-analytics.type"

const outcomeConfig = {
  success: { label: "Success", color: "var(--chart-1)" },
  partial: { label: "Partial", color: "var(--chart-3)" },
  failed: { label: "Failed", color: "var(--chart-4)" },
  rejected: { label: "Rejected", color: "var(--chart-5)" },
} satisfies ChartConfig

const durationConfig = {
  averageSeconds: { label: "Average seconds", color: "var(--chart-2)" },
} satisfies ChartConfig

export function TaskAnalyticsCharts({
  outcomes,
  executionTimes,
}: {
  outcomes: TaskOutcomePoint[]
  executionTimes: ExecutionTimePoint[]
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <Card className="gap-0 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
        <CardHeader className="px-4">
          <CardTitle className="type-caption text-foreground">
            Task Outcomes – Last 7 Days
          </CardTitle>
          <p className="type-caption text-muted-foreground">
            Completed tasks grouped by final status
          </p>
        </CardHeader>
        <CardContent className="mt-4 px-4">
          <ChartContainer config={outcomeConfig} className="h-56 w-full aspect-auto">
            <BarChart data={outcomes} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="success" stackId="outcome" fill="var(--color-success)" radius={[0, 0, 3, 3]} />
              <Bar dataKey="partial" stackId="outcome" fill="var(--color-partial)" />
              <Bar dataKey="failed" stackId="outcome" fill="var(--color-failed)" />
              <Bar dataKey="rejected" stackId="outcome" fill="var(--color-rejected)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="gap-0 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
        <CardHeader className="px-4">
          <CardTitle className="type-caption text-foreground">
            Execution Time Trend
          </CardTitle>
          <p className="type-caption text-muted-foreground">
            Average end-to-end task duration in seconds
          </p>
        </CardHeader>
        <CardContent className="mt-4 px-4">
          <ChartContainer config={durationConfig} className="h-56 w-full aspect-auto">
            <LineChart data={executionTimes} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} unit="s" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="averageSeconds"
                stroke="var(--color-averageSeconds)"
                strokeWidth={2}
                dot={{ fill: "var(--color-averageSeconds)", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
}
