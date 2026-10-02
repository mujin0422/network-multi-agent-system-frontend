import { cn } from "@/lib/utils"
import type { ChartBar } from "../types"

export function BarChart({ bars, color }: { bars: ChartBar[]; color: "green" | "blue" }) {
  return <div className="flex h-[126px] items-end justify-between gap-3 px-2 sm:px-4">{bars.map((bar) => <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className={cn("w-full max-w-[22px] rounded-t-[4px] transition-all hover:opacity-80", color === "green" ? "bg-[#36bd83]" : "bg-[#74a5e5]")} style={{ height: bar.height }} /><span className="text-[9px] text-muted-foreground">{bar.label}</span></div>)}</div>
}
