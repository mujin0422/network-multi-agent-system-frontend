import { cn } from "@/lib/utils"
import type { ChartBar } from "../types/chart-bar.type"

/** Biểu đồ cột nhỏ dùng để trực quan hóa số liệu tổng quan trên dashboard. */
export function BarChart({
  bars,
  color,
}: {
  bars: ChartBar[]
  color: "green" | "blue"
}) {
  return (
    <div className="flex h-32 items-end justify-between gap-3 px-2 sm:px-4">
      {bars.map((bar) => (
        <div
          key={bar.label}
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
        >
          <div
            className={cn(
              "w-full max-w-6 rounded-t-sm transition-all hover:opacity-80",
              color === "green" ? "bg-[#36bd83]" : "bg-[#74a5e5]",
            )}
            style={{ height: bar.height }}
          />
          <span className="type-caption text-muted-foreground">{bar.label}</span>
        </div>
      ))}
    </div>
  )
}
