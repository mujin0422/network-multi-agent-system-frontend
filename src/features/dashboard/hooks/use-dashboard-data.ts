import { useCallback, useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  ListTodo,
  Router,
} from "lucide-react"
import { benchmarksApi, devicesApi, evaluationsApi, tasksApi } from "@/service"
import type { BenchmarkRun, BenchmarkRunSummary, TaskEvaluationSummary } from "@/service"
import type { ChartBar } from "../types/chart-bar.type"
import type { Metric } from "../types/metric.type"
import type {
  ExecutionTimePoint,
  TaskOutcomePoint,
} from "../types/task-analytics.type"
import { buildBenchmarkRates, type DashboardRateMetric } from "../utils/benchmark-rates.util"

const DAY_MS = 86_400_000

function summarizeRuns(runs: BenchmarkRun[]): BenchmarkRunSummary {
  const passed = runs.filter((run) => run.evaluation_result === "PASS").length
  const failed = runs.filter((run) => run.evaluation_result === "FAIL").length
  const inProgress = runs.filter((run) => ["PREPARING", "READY", "RUNNING"].includes(run.status)).length
  const setupFailed = runs.filter((run) => run.status === "FAILED" && run.source_message_id == null).length
  const unscored = runs.filter((run) =>
    run.source_message_id != null && run.evaluation_result == null && !["PREPARING", "READY", "RUNNING"].includes(run.status),
  ).length
  const eligibleRuns = passed + failed
  return {
    total_runs: runs.length,
    passed,
    failed,
    in_progress: inProgress,
    not_started: 0,
    setup_failed: setupFailed,
    unscored,
    eligible_runs: eligibleRuns,
    success_rate: eligibleRuns ? Math.round((passed / eligibleRuns) * 1000) / 10 : null,
  }
}

function localDateBounds(range?: DateRange) {
  if (!range?.from) return null
  const to = range.to ?? range.from
  return {
    start: new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate()),
    end: new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1),
  }
}

export function useDashboardData(rateDateRange?: DateRange) {
  const [taskBars, setTaskBars] = useState<ChartBar[]>([])
  const [taskOutcomes, setTaskOutcomes] = useState<TaskOutcomePoint[]>([])
  const [taskOutcomes30, setTaskOutcomes30] = useState<TaskOutcomePoint[]>([])
  const [executionTimes, setExecutionTimes] = useState<ExecutionTimePoint[]>([])
  const [executionTimes30, setExecutionTimes30] = useState<ExecutionTimePoint[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [successRate, setSuccessRate] = useState(0)
  const [rateSummary, setRateSummary] = useState<BenchmarkRunSummary | null>(null)
  const [rateEvaluations, setRateEvaluations] = useState<TaskEvaluationSummary[] | null>(null)
  const [rateRuns, setRateRuns] = useState<BenchmarkRun[] | null>(null)
  const [rateError, setRateError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    setRateError(null)
    try {
      // Benchmark metrics have independent permissions and failure states.
      // One unavailable endpoint must not break the regular Dashboard.
      const [dashboardResult, summaryResult, evaluationResult, runsResult] = await Promise.allSettled([
        Promise.all([
          tasksApi.list(),
          devicesApi.list({ page_size: 100 }),
        ]),
        benchmarksApi.getRunSummary(),
        evaluationsApi.list(100),
        benchmarksApi.listAllRuns(),
      ])
      setRateSummary(summaryResult.status === "fulfilled" ? summaryResult.value : null)
      setRateEvaluations(evaluationResult.status === "fulfilled" ? evaluationResult.value : null)
      setRateRuns(runsResult.status === "fulfilled" ? runsResult.value : null)
      const unavailable = [
        summaryResult.status === "rejected" ? "run summary" : null,
        evaluationResult.status === "rejected" ? "evaluations" : null,
        runsResult.status === "rejected" ? "recent runs" : null,
      ].filter((name): name is string => name !== null)
      if (unavailable.length) {
        setRateError(`Some metrics are unavailable: ${unavailable.join(", ")}.`)
      }
      if (dashboardResult.status === "rejected") throw dashboardResult.reason
      const [tasks, devicePage] = dashboardResult.value
      const terminal = tasks.filter((task) => ["SUCCESS", "PARTIAL_SUCCESS", "FAILED", "REJECTED"].includes(task.task_status))
      const rate = terminal.length
        ? Math.round((terminal.filter((task) => task.task_status === "SUCCESS").length / terminal.length) * 1000) / 10
        : 0
      setSuccessRate(rate)
      setMetrics([
        { label: "Total Devices", value: String(devicePage.total), change: "Managed inventory", tone: "running", icon: Router },
        { label: "Total Tasks", value: tasks.length.toLocaleString(), change: "Automation requests", tone: "running", icon: ListTodo },
        { label: "Success Rate", value: `${rate}%`, change: `${terminal.length} completed`, tone: "success", icon: CheckCircle2 },
        { label: "Pending Tasks", value: String(tasks.filter((task) => task.task_status === "PENDING").length), change: "Waiting to start", tone: "waiting", icon: Clock3 },
        { label: "Needs Attention", value: String(tasks.filter((task) => ["PARTIAL_SUCCESS", "FAILED", "REJECTED"].includes(task.task_status)).length), change: "Partial, failed or rejected", tone: "danger", icon: CircleAlert },
      ])

      const now = new Date()
      const days = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index))
        const next = new Date(day.getTime() + DAY_MS)
        return {
          label: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(day),
          day,
          next,
        }
      })
      const dayCounts = days.map(({ label, day, next }) => ({
          label,
          count: tasks.filter((task) => {
            const created = new Date(task.created_at)
            return created >= day && created < next
          }).length,
      }))
      const maxTasks = Math.max(...dayCounts.map((item) => item.count), 1)
      setTaskBars(dayCounts.map((item) => ({
        label: item.label,
        height: item.count ? 16 + (item.count / maxTasks) * 96 : 0,
        value: item.count,
      })))

      // Compute genuine day-by-day results for each selectable period.
      // Each time bucket follows local calendar boundaries (including DST),
      // and the 30-day labels show dates rather than repeated weekdays.
      const outcomesForPeriod = (period: 7 | 30): TaskOutcomePoint[] =>
        Array.from({ length: period }, (_, index) => {
          const day = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - (period - 1 - index),
          )
          const next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
          const label = period === 7
            ? new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(day)
            : new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short" }).format(day)

          const completed = tasks.filter((task) => {
            if (!task.completed_at) return false
            const completedAt = new Date(task.completed_at)
            return completedAt >= day && completedAt < next
          })
          return {
            label,
            success: completed.filter((task) => task.task_status === "SUCCESS").length,
            partial: completed.filter((task) => task.task_status === "PARTIAL_SUCCESS").length,
            failed: completed.filter((task) => task.task_status === "FAILED").length,
            rejected: completed.filter((task) => task.task_status === "REJECTED").length,
          }
        })

      setTaskOutcomes(outcomesForPeriod(7))
      setTaskOutcomes30(outcomesForPeriod(30))

      const executionTimesForPeriod = (period: 7 | 30): ExecutionTimePoint[] =>
        Array.from({ length: period }, (_, index) => {
          const day = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - (period - 1 - index),
          )
          const next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
          const label = period === 7
            ? new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(day)
            : new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short" }).format(day)
          const durations = tasks.flatMap((task) => {
            if (!task.started_at || !task.completed_at) return []
            const startedAt = new Date(task.started_at)
            const completedAt = new Date(task.completed_at)
            if (completedAt < day || completedAt >= next) return []
            const durationSeconds = (completedAt.getTime() - startedAt.getTime()) / 1000
            return durationSeconds >= 0 ? [durationSeconds] : []
          })
          const averageSeconds = durations.length
            ? Math.round((durations.reduce((total, duration) => total + duration, 0) / durations.length) * 10) / 10
            : 0
          return { label, averageSeconds, taskCount: durations.length }
        })

      setExecutionTimes(executionTimesForPeriod(7))
      setExecutionTimes30(executionTimesForPeriod(30))

    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ dashboard với API khi mount.
  useEffect(() => { void reload() }, [reload])

  const rateMetrics = useMemo<DashboardRateMetric[]>(() => {
    const bounds = localDateBounds(rateDateRange)
    if (!bounds) {
      return buildBenchmarkRates({
        summary: rateSummary,
        evaluations: rateEvaluations,
        runs: rateRuns,
      })
    }

    const runs = rateRuns?.filter((run) => {
      const startedAt = new Date(run.started_at)
      return !Number.isNaN(startedAt.getTime()) && startedAt >= bounds.start && startedAt < bounds.end
    }) ?? null
    const evaluationIds = new Set(runs?.flatMap((run) => run.evaluation_id ? [run.evaluation_id] : []) ?? [])
    const evaluations = rateEvaluations?.filter((evaluation) => evaluationIds.has(evaluation.id)) ?? null

    return buildBenchmarkRates({
      summary: runs ? summarizeRuns(runs) : null,
      evaluations,
      runs,
      filtered: true,
    })
  }, [rateDateRange, rateEvaluations, rateRuns, rateSummary])

  return {
    metrics, taskBars,
    taskOutcomes, taskOutcomes30, executionTimes, executionTimes30,
    successRate, rateMetrics, rateError,
    loading, error, reload,
  }
}
