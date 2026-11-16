import type { DateRange } from "react-day-picker"

import type { BenchmarkRun } from "@/service"
import {
  ACTIVE_BENCHMARK_RUN_STATUSES,
  COMPLETED_BENCHMARK_RUN_STATUSES,
} from "../constants/benchmark-runs.constants"
import type { BenchmarkRunGroup, BenchmarkRunRow, BenchmarkRunSummary } from "../types/benchmark-run.type"

export function benchmarkRunGroup(run: BenchmarkRun): BenchmarkRunGroup {
  if (run.status === "FAILED" || run.cleanup_required) return "ATTENTION"
  if ((ACTIVE_BENCHMARK_RUN_STATUSES as readonly string[]).includes(run.status)) return "ACTIVE"
  return "COMPLETED"
}

export function filterBenchmarkRuns(runs: BenchmarkRun[], range?: DateRange): BenchmarkRunRow[] {
  const from = range?.from
  const to = range?.to ?? from
  const start = from ? new Date(from.getFullYear(), from.getMonth(), from.getDate()) : null
  const end = to ? new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1) : null
  return runs
    .filter((run) => {
      if (!start || !end) return true
      const startedAt = new Date(run.started_at)
      return !Number.isNaN(startedAt.getTime()) && startedAt >= start && startedAt < end
    })
    .map((run) => ({ ...run, runGroup: benchmarkRunGroup(run) }))
}

export function summarizeBenchmarkRuns(runs: BenchmarkRun[]): BenchmarkRunSummary {
  return {
    total: runs.length,
    inProgress: runs.filter((run) => (ACTIVE_BENCHMARK_RUN_STATUSES as readonly string[]).includes(run.status)).length,
    completed: runs.filter((run) => (COMPLETED_BENCHMARK_RUN_STATUSES as readonly string[]).includes(run.status)).length,
    needsAttention: runs.filter((run) => run.status === "FAILED" || run.cleanup_required).length,
  }
}
