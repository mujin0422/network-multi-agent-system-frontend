import type { ChartBar } from "../types/chart-bar.type"

export function totalChartValue(bars: readonly ChartBar[]) {
  return bars.reduce((total, bar) => total + bar.height, 0)
}
