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
  secondaryColor: string
  positiveLabel: string
  negativeLabel: string
  value: number | null
  sampleSize: number | null
  numerator?: number
  scope: string
}

type RateInputs = {
  summary: BenchmarkRunSummary | null
  evaluations: TaskEvaluationSummary[] | null
  runs: BenchmarkRun[] | null
  filtered?: boolean
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
 * - GOAL, RCA and F1 use completed evaluations from the last 100 results.
 * - Cleanup coverage uses the complete run history and is not a claim of remediation.
 *
 * An unavailable endpoint yields null (a dash), never an invented 0% score.
 */
export function buildBenchmarkRates({
  summary,
  evaluations,
  runs,
  filtered = false,
}: RateInputs): DashboardRateMetric[] {
  const runScope = filtered
    ? "Selected dates · complete run history"
    : "All benchmark runs · mixed evaluator versions"
  const evaluationScope = filtered
    ? "Selected dates · latest 100 evaluations"
    : "Latest 100 completed evaluations"
  const completedEvaluations = evaluations?.filter(
    (evaluation) => evaluation.evaluation_status === "COMPLETED",
  )
  const goalScored = completedEvaluations?.filter((evaluation) => hasResult(evaluation.results.GOAL))
  const rcaScored = completedEvaluations?.filter((evaluation) => hasResult(evaluation.results.RCA))
  const goalPassed = goalScored?.filter((evaluation) => evaluation.results.GOAL === "PASS").length ?? 0
  const rcaPassed = rcaScored?.filter((evaluation) => evaluation.results.RCA === "PASS").length ?? 0

  const f1Values = completedEvaluations?.flatMap((evaluation) => {
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
      description: filtered
        ? "Percentage of eligible Benchmark Runs in the selected dates that passed GOAL: passed / (passed + failed). In-progress, setup-failed and unscored runs are excluded."
        : "Percentage of eligible Benchmark Runs that passed GOAL: passed / (passed + failed). In-progress, setup-failed and unscored runs are excluded. The all-time history includes older evaluator versions.",
      color: "#16a34a",
      secondaryColor: "#14532d",
      positiveLabel: "Task Success",
      negativeLabel: "Task Fail",
      value: summary?.success_rate ?? null,
      sampleSize: summary?.eligible_runs ?? null,
      numerator: summary?.passed,
      scope: runScope,
    },
    {
      id: "goal",
      label: "Goal Pass Rate",
      description: "Percentage of completed evaluations with GOAL PASS among those scored PASS or FAIL.",
      color: "#0891b2",
      secondaryColor: "#164e63",
      positiveLabel: "GOAL Pass",
      negativeLabel: "GOAL Fail",
      value: goalScored ? asPercent(goalPassed, goalScored.length) : null,
      sampleSize: goalScored?.length ?? null,
      numerator: goalPassed,
      scope: evaluationScope,
    },
    {
      id: "rca",
      label: "RCA Pass Rate",
      description: "Percentage of completed RCA evaluations that pass according to the evaluator used by each run.",
      color: "#7c3aed",
      secondaryColor: "#4c1d95",
      positiveLabel: "RCA Pass",
      negativeLabel: "RCA Fail",
      value: rcaScored ? asPercent(rcaPassed, rcaScored.length) : null,
      sampleSize: rcaScored?.length ?? null,
      numerator: rcaPassed,
      scope: evaluationScope,
    },
    {
      id: "rca-f1",
      label: "Average RCA F1",
      description: "Average RCA F1 across completed evaluations that contain an RCA F1 measurement. The remainder to 100% is a score gap, not a number of failed tasks.",
      color: "#d97706",
      secondaryColor: "#78350f",
      positiveLabel: "F1 Score",
      negativeLabel: "Remaining",
      value: meanF1,
      sampleSize: f1Values?.length ?? null,
      scope: evaluationScope,
    },
    {
      id: "completion",
      label: "Run Finalization",
      description: "Percentage of started Benchmark Runs with a terminal outcome (passed, failed or unscored), excluding runs still in progress. Runs that never reached Agent execution are excluded.",
      color: "#2563eb",
      secondaryColor: "#1e3a8a",
      positiveLabel: "Finalized",
      negativeLabel: "In Progress",
      value: summary ? asPercent(finalized, started) : null,
      sampleSize: summary ? started : null,
      numerator: summary ? finalized : undefined,
      scope: filtered ? "Selected dates · terminal outcomes" : "All benchmark runs · terminal outcomes",
    },
    {
      id: "cleanup",
      label: "Cleanup Coverage",
      description: "Share of recent finished Benchmark Runs that reached CLEANED rather than remaining COMPLETED. This tracks benchmark environment cleanup, not successful Agent remediation.",
      color: "#e11d48",
      secondaryColor: "#881337",
      positiveLabel: "Cleaned",
      negativeLabel: "Not Cleaned",
      value: finishedRuns ? asPercent(cleaned, finishedRuns.length) : null,
      sampleSize: finishedRuns?.length ?? null,
      numerator: cleaned,
      scope: filtered ? "Selected dates · complete run history" : "All benchmark runs · not remediation success",
    },
  ]
}
