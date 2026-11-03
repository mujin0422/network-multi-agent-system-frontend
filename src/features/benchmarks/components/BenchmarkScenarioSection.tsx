import { cn } from "@/lib/utils"
import type { BenchmarkScenarioSectionProps } from "../types/benchmark.type"

export function BenchmarkScenarioSection({ title, description, children, plain = false }: BenchmarkScenarioSectionProps) {
  return (
    <section className={cn("space-y-4", !plain && "rounded-xl border bg-muted/10 p-4")}>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="type-caption text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}
