import type { TaskEvaluationSummary } from "@/service"

export type BenchmarkTrendPoint = {
  label: string
  dayKey: number
  sampleSize: number
  goalRate: number | null
  goalScored: number
  rcaRate: number | null
  rcaScored: number
  rcaF1: number | null
  f1Scored: number
}

export type RcaQualityKey =
  | "rca_precision"
  | "rca_recall"
  | "rca_f1"
  | "localization_f1"
  | "fault_type_f1"

export type RcaQualityPoint = {
  key: RcaQualityKey
  label: string
  value: number | null
  sampleSize: number
  color: string
}

export type BenchmarkAnalytics = {
  fetchedCount: number
  v4CompletedCount: number
  trend7: BenchmarkTrendPoint[]
  trend30: BenchmarkTrendPoint[]
  quality: RcaQualityPoint[]
}

const QUALITY_METRICS: ReadonlyArray<Pick<RcaQualityPoint, "key" | "label" | "color">> = [
  { key: "rca_precision", label: "Precision", color: "#0891b2" },
  { key: "rca_recall", label: "Recall", color: "#7c3aed" },
  { key: "rca_f1", label: "RCA F1", color: "#d97706" },
  { key: "localization_f1", label: "Localization F1", color: "#16a34a" },
  { key: "fault_type_f1", label: "Fault Type F1", color: "#2563eb" },
]

function validScore(score: unknown): score is number {
  return typeof score === "number" &&
    Number.isFinite(score) &&
    score >= 0 &&
    score <= 1
}

function percent(numerator: number, denominator: number): number | null {
  return denominator ? Math.round((numerator / denominator) * 1000) / 10 : null
}

type DailyCounts = {
  sampleSize: number
  goalScored: number
  goalPassed: number
  rcaScored: number
  rcaPassed: number
  f1Scored: number
  f1Sum: number
}

/**
 * GET /evaluations is a most-recent-first sample capped at 100 rows, NOT full history.
 * Scope every statistic to completed db-benchmark-v4 evaluations in that sample.
 * Trends use evaluated_at (UTC timestamp rendered in the viewer's local calendar).
 * Missing days and missing scores stay null, never a fabricated zero.
 */
export function buildBenchmarkAnalytics(
  evaluations: TaskEvaluationSummary[] | null,
  now = new Date(),
): BenchmarkAnalytics {
  const v4 = (evaluations ?? []).filter(
    (evaluation) =>
      evaluation.evaluator_version === "db-benchmark-v4" &&
      evaluation.evaluation_status === "COMPLETED",
  )

  const quality = QUALITY_METRICS.map(({ key, label, color }) => {
    const scores = v4.flatMap((evaluation) => {
      const score = evaluation.scores?.[key]
      return validScore(score) ? [score] : []
    })
    return {
      key,
      label,
      color,
      sampleSize: scores.length,
      value: scores.length
        ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 1000) / 10
        : null,
    }
  })

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(
      startOfToday.getFullYear(),
      startOfToday.getMonth(),
      startOfToday.getDate() - (29 - index),
    )
    const dayKey = date.getTime()
    return {
      dayKey,
      label: new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short" }).format(date),
    }
  })
  const byDay = new Map<number, DailyCounts>(
    days.map(({ dayKey }) => [
      dayKey,
      {
        sampleSize: 0,
        goalScored: 0,
        goalPassed: 0,
        rcaScored: 0,
        rcaPassed: 0,
        f1Scored: 0,
        f1Sum: 0,
      },
    ]),
  )

  for (const evaluation of v4) {
    if (!evaluation.evaluated_at) continue
    const timestamp = new Date(evaluation.evaluated_at)
    if (!Number.isFinite(timestamp.getTime()) || timestamp.getTime() > now.getTime()) continue
    const dayKey = new Date(
      timestamp.getFullYear(),
      timestamp.getMonth(),
      timestamp.getDate(),
    ).getTime()
    const day = byDay.get(dayKey)
    if (!day) continue

    day.sampleSize++
    if (evaluation.results.GOAL === "PASS" || evaluation.results.GOAL === "FAIL") {
      day.goalScored++
      if (evaluation.results.GOAL === "PASS") day.goalPassed++
    }
    if (evaluation.results.RCA === "PASS" || evaluation.results.RCA === "FAIL") {
      day.rcaScored++
      if (evaluation.results.RCA === "PASS") day.rcaPassed++
    }
    const f1 = evaluation.scores?.rca_f1
    if (validScore(f1)) {
      day.f1Scored++
      day.f1Sum += f1
    }
  }

  const trend30 = days.map(({ label, dayKey }): BenchmarkTrendPoint => {
    const day = byDay.get(dayKey)!
    return {
      label,
      dayKey,
      sampleSize: day.sampleSize,
      goalRate: percent(day.goalPassed, day.goalScored),
      goalScored: day.goalScored,
      rcaRate: percent(day.rcaPassed, day.rcaScored),
      rcaScored: day.rcaScored,
      rcaF1: day.f1Scored ? Math.round((day.f1Sum / day.f1Scored) * 1000) / 10 : null,
      f1Scored: day.f1Scored,
    }
  })

  return {
    fetchedCount: evaluations?.length ?? 0,
    v4CompletedCount: v4.length,
    trend7: trend30.slice(-7),
    trend30,
    quality,
  }
}
