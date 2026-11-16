import type { BenchmarkRun } from "@/service"

export type BenchmarkRunGroup = "ACTIVE" | "COMPLETED" | "ATTENTION"
export type BenchmarkRunRow = BenchmarkRun & { runGroup: BenchmarkRunGroup }
export type BenchmarkRunSummary = {
  total: number
  inProgress: number
  completed: number
  needsAttention: number
}
