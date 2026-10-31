import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartBar } from "../types/chart-bar.type"

/** Biểu đồ dashboard dùng chung animation và tooltip của Recharts. */
export function BarChart({
  bars,
  color,
  orientation = "vertical",
  valueLabel = "Items",
}: {
  bars: ChartBar[]
  color: "green" | "blue"
  orientation?: "horizontal" | "vertical"
  valueLabel?: string
}) {
  const config = {
    value: {
      label: valueLabel[0]?.toUpperCase() + valueLabel.slice(1),
      color: color === "green" ? "var(--chart-1)" : "var(--chart-2)",
    },
  } satisfies ChartConfig
  const data = bars.map((bar) => ({
    label: bar.label,
    value: bar.value ?? 0,
  }))

  if (orientation === "horizontal") {
    return (
      <ChartContainer config={config} className="h-56 w-full aspect-auto">
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 40, bottom: 4, left: 0 }}
          barCategoryGap={10}
          accessibilityLayer
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" hide domain={[0, "dataMax"]} />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[0, 8, 8, 0]}
            animationDuration={700}
          >
            <LabelList
              dataKey="value"
              position="right"
              className="fill-foreground font-mono"
              fontSize={11}
            />
          </Bar>
        </RechartsBarChart>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer config={config} className="h-56 w-full aspect-auto">
      <RechartsBarChart
        data={data}
        margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
        barCategoryGap="28%"
        accessibilityLayer
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis hide allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[6, 6, 0, 0]}
          animationDuration={700}
        />
      </RechartsBarChart>
    </ChartContainer>
  )
}
