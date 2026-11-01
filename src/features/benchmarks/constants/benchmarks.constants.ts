import type { BenchmarkAction, BenchmarkRun } from "@/service"

export const BENCHMARK_STATUS_KEYS: Record<BenchmarkRun["status"], string> = {
  PREPARING: "benchmarks.status.PREPARING",
  READY: "benchmarks.status.READY",
  RUNNING: "benchmarks.status.RUNNING",
  COMPLETED: "benchmarks.status.COMPLETED",
  FAILED: "benchmarks.status.FAILED",
  CLEANED: "benchmarks.status.CLEANED",
}

export const BENCHMARK_ACTION_OPTIONS: Array<{
  value: BenchmarkAction["action"]
  labelKey: string
}> = [
  { value: "interface_shutdown", labelKey: "benchmarks.form.actions.interfaceShutdown" },
  { value: "interface_no_shutdown", labelKey: "benchmarks.form.actions.interfaceNoShutdown" },
]
