import { CheckCircle2, FlaskConical, Play, ShieldAlert } from "lucide-react"

import { PageLayoutOverview, PageLayoutStat } from "@/components/shared/PageLayout"
import type { BenchmarkSummary } from "../types/benchmark.type"

export function BenchmarkStats({ summary }: { summary: BenchmarkSummary }) {
  return (
    <PageLayoutOverview>
      <PageLayoutStat
        label="benchmarks.stats.total.label"
        value={summary.total}
        description="benchmarks.stats.total.description"
        icon={<FlaskConical />}
      />
      <PageLayoutStat
        label="benchmarks.stats.inProgress.label"
        value={summary.inProgress}
        description="benchmarks.stats.inProgress.description"
        icon={<Play />}
      />
      <PageLayoutStat
        label="benchmarks.stats.completed.label"
        value={summary.completed}
        description="benchmarks.stats.completed.description"
        icon={<CheckCircle2 />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="benchmarks.stats.needsAttention.label"
        value={summary.needsAttention}
        description="benchmarks.stats.needsAttention.description"
        icon={<ShieldAlert />}
        iconClassName="bg-amber-500/10 text-amber-400"
      />
    </PageLayoutOverview>
  )
}
