import type { BenchmarkRun, BenchmarkRunSummary, TaskEvaluationSummary } from "@/service"

/**
 * Mirrors backend benchmark/utils/summary.py for date-scoped Dashboard cohorts.
 *
 * BenchmarkRun.evaluation_result is RCA, NOT GOAL. Never use it for TSR.
 * All-history TSR is fetched from the authoritative /benchmarks/runs/summary API.
 */
export function summarizeBenchmarkRuns(
  runs: BenchmarkRun[],
  evaluations: TaskEvaluationSummary[],
): BenchmarkRunSummary {
  const goalByEvaluationId = new Map(
    evaluations.map((evaluation) => [evaluation.id, evaluation.results.GOAL]),
  )
  const counts = {
    passed: 0,
    failed: 0,
    in_progress: 0,
    not_started: 0,
    setup_failed: 0,
    unscored: 0,
  }

  for (const run of runs) {
    const hasSource = run.source_message_id !== null
    const hasError = run.error_message !== null
    const goal = run.evaluation_id ? goalByEvaluationId.get(run.evaluation_id) : undefined

    if (run.status === "PREPARING" || run.status === "READY") {
      counts.not_started += 1
    } else if (run.status === "RUNNING") {
      counts.in_progress += 1
    } else if (run.status === "FAILED") {
      counts[hasSource ? "failed" : "setup_failed"] += 1
    } else if (run.status === "COMPLETED" || run.status === "CLEANED") {
      if (run.evaluation_id && goal === "PASS") {
        counts.passed += 1
      } else if (run.evaluation_id && goal === "FAIL") {
        counts.failed += 1
      } else if (hasSource) {
        counts[hasError ? "failed" : "unscored"] += 1
      } else {
        counts[hasError ? "setup_failed" : "not_started"] += 1
      }
    } else {
      counts.unscored += 1
    }
  }

  const eligibleRuns = counts.passed + counts.failed
  return {
    ...counts,
    total_runs: runs.length,
    eligible_runs: eligibleRuns,
    success_rate: eligibleRuns ? Math.round((counts.passed / eligibleRuns) * 10_000) / 100 : null,
  }
}
