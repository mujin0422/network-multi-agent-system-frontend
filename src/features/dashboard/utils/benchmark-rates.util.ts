import type {
  BenchmarkRun,
  BenchmarkRunSummary,
  TaskEvaluationSummary,
} from "@/service"

export type DashboardRateMetric = {
  id: string
  label: string
  description: string
  color: string
  value: number | null
  sampleSize: number | null
  numerator?: number
  scope: string
}

type RateInputs = {
  summary: BenchmarkRunSummary | null
  evaluations: TaskEvaluationSummary[] | null
  runs: BenchmarkRun[] | null
}

function asPercent(numerator: number, denominator: number): number | null {
  return denominator > 0
    ? Math.round((numerator / denominator) * 1000) / 10
    : null
}

const hasResult = (value: unknown): value is "PASS" | "FAIL" =>
  value === "PASS" || value === "FAIL"

/**
 * Rates use real persisted API data.
 * - TSR and run finalization are derived from the backend's all-run summary.
 * - GOAL, RCA and F1 use only v4 evaluations from the last 100 results.
 * - Cleanup coverage uses the last 100 runs and is not a claim of remediation.
 *
 * An unavailable endpoint yields null (a dash), never an invented 0% score.
 */
export function buildBenchmarkRates({
  summary,
  evaluations,
  runs,
}: RateInputs): DashboardRateMetric[] {
  const v4 = evaluations?.filter(
    (evaluation) =>
      evaluation.evaluator_version === "db-benchmark-v4" &&
      evaluation.evaluation_status === "COMPLETED",
  )
  const goalScored = v4?.filter((evaluation) => hasResult(evaluation.results.GOAL))
  const rcaScored = v4?.filter((evaluation) => hasResult(evaluation.results.RCA))
  const goalPassed = goalScored?.filter((evaluation) => evaluation.results.GOAL === "PASS").length ?? 0
  const rcaPassed = rcaScored?.filter((evaluation) => evaluation.results.RCA === "PASS").length ?? 0

  const f1Values = v4?.flatMap((evaluation) => {
    const score = evaluation.scores?.rca_f1
    return typeof score === "number" && Number.isFinite(score) && score >= 0 && score <= 1
      ? [score]
      : []
  })
  const meanF1 = f1Values?.length
    ? Math.round((f1Values.reduce((sum, value) => sum + value, 0) / f1Values.length) * 1000) / 10
    : null

  // A run is finalized once it has a recorded terminal outcome, including a
  // failed or unscored AI attempt. In-progress attempts remain in the denominator.
  const finalized = summary
    ? summary.passed + summary.failed + summary.unscored
    : 0
  const started = summary ? finalized + summary.in_progress : 0

  // "Cleanup coverage" is the share of completed benchmark attempts that have
  // reached CLEANED. There is no API to prove a separate "cleanup success rate".
  const finishedRuns = runs?.filter(
    (run) =>
      run.source_message_id != null &&
      (run.status === "COMPLETED" || run.status === "CLEANED"),
  )
  const cleaned = finishedRuns?.filter((run) => run.status === "CLEANED").length ?? 0

  return [
    {
      id: "tsr",
      label: "Task Success Rate",
      description: "GOAL pass / scored outcomes",
      color: "#34d399",
      value: summary?.success_rate ?? null,
      sampleSize: summary?.eligible_runs ?? null,
      numerator: summary?.passed,
      scope: "All benchmark runs · mixed evaluator versions",
    },
    {
      id: "goal",
      label: "Goal Pass Rate",
      description: "GOAL passes on v4",
      color: "#22d3ee",
      value: goalScored ? asPercent(goalPassed, goalScored.length) : null,
      sampleSize: goalScored?.length ?? null,
      numerator: goalPassed,
      scope: "v4 only · latest 100 evaluations",
    },
    {
      id: "rca",
      label: "RCA Pass Rate",
      description: "Exact root-cause matches",
      color: "#a78bfa",
      value: rcaScored ? asPercent(rcaPassed, rcaScored.length) : null,
      sampleSize: rcaScored?.length ?? null,
      numerator: rcaPassed,
      scope: "v4 only · latest 100 evaluations",
    },
    {
      id: "rca-f1",
      label: "Average RCA F1",
      description: "Mean structured RCA score",
      color: "#fbbf24",
      value: meanF1,
      sampleSize: f1Values?.length ?? null,
      scope: "v4 only · latest 100 evaluations",
    },
    {
      id: "completion",
      label: "Run Finalization",
      description: "Finalized / started runs",
      color: "#60a5fa",
      value: summary ? asPercent(finalized, started) : null,
      sampleSize: summary ? started : null,
      numerator: summary ? finalized : undefined,
      scope: "All benchmark runs · terminal outcomes",
    },
    {
      id: "cleanup",
      label: "Cleanup Coverage",
      description: "Finished runs cleaned",
      color: "#fb7185",
      value: finishedRuns ? asPercent(cleaned, finishedRuns.length) : null,
      sampleSize: finishedRuns?.length ?? null,
      numerator: cleaned,
      scope: "Latest 100 runs · not remediation success",
    },
  ]
}
