import { useCallback, useEffect, useState } from "react"
import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ListTodo,
  Router,
  Terminal,
} from "lucide-react"
import { benchmarksApi, devicesApi, evaluationsApi, tasksApi } from "@/service"
import type { Operation, Task, TaskStatus } from "@/service"
import type { ActivityItem, DashboardStatus } from "../types/activity-item.type"
import type { ChartBar } from "../types/chart-bar.type"
import type { Metric } from "../types/metric.type"
import type {
  ExecutionTimePoint,
  TaskOutcomePoint,
} from "../types/task-analytics.type"
import type { Tone } from "../types/tone.type"
import { buildBenchmarkRates, type DashboardRateMetric } from "../utils/benchmark-rates.util"

const DAY_MS = 86_400_000

function toneForStatus(status: TaskStatus | string): Tone {
  if (status === "SUCCESS") return "success"
  if (status === "RUNNING" || status === "PLANNING") return "running"
  if (status === "PENDING" || status === "WAITING_APPROVAL") return "waiting"
  return "danger"
}

function dashboardStatus(status: TaskStatus | string): DashboardStatus {
  if (status === "PLANNING") return "RUNNING"
  if (["PENDING", "RUNNING", "SUCCESS", "PARTIAL_SUCCESS", "FAILED", "REJECTED", "WAITING_APPROVAL"].includes(status)) {
    return status as DashboardStatus
  }
  return "PENDING"
}

function shortTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function taskActivity(task: Task): ActivityItem {
  return {
    title: task.input_message,
    detail: `${task.id} · ${task.task_type} · ${shortTime(task.created_at)}`,
    status: dashboardStatus(task.task_status),
    tone: toneForStatus(task.task_status),
    icon: task.task_status === "SUCCESS" ? CheckCircle2 : task.task_status === "FAILED" ? CircleAlert : Activity,
  }
}

function operationActivity(operation: Operation): ActivityItem {
  return {
    title: operation.operation_intent.replaceAll("_", " "),
    detail: `${operation.task_id} · ${shortTime(operation.created_at)}`,
    status: dashboardStatus(operation.operation_status),
    tone: toneForStatus(operation.operation_status),
    icon: Terminal,
  }
}

export function useDashboardData() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [deviceActions, setDeviceActions] = useState<ActivityItem[]>([])
  const [taskBars, setTaskBars] = useState<ChartBar[]>([])
  const [taskOutcomes, setTaskOutcomes] = useState<TaskOutcomePoint[]>([])
  const [executionTimes, setExecutionTimes] = useState<ExecutionTimePoint[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [successRate, setSuccessRate] = useState(0)
  const [rateMetrics, setRateMetrics] = useState<DashboardRateMetric[]>(() =>
    buildBenchmarkRates({ summary: null, evaluations: null, runs: null }),
  )
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
        benchmarksApi.listRuns(100),
      ])
      setRateMetrics(buildBenchmarkRates({
        summary: summaryResult.status === "fulfilled" ? summaryResult.value : null,
        evaluations: evaluationResult.status === "fulfilled" ? evaluationResult.value : null,
        runs: runsResult.status === "fulfilled" ? runsResult.value : null,
      }))
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
      const sortedTasks = [...tasks].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
      const details = await Promise.all(sortedTasks.slice(0, 6).map((task) => tasksApi.get(task.id)))
      const operations = details
        .flatMap((task) => task.operations)
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))

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
      setActivities(sortedTasks.slice(0, 5).map(taskActivity))
      setDeviceActions(operations.slice(0, 5).map(operationActivity))

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

      setTaskOutcomes(days.map(({ label, day, next }) => {
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
      }))

      setExecutionTimes(days.map(({ label, day, next }) => {
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
      }))

    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ dashboard với API khi mount.
  useEffect(() => { void reload() }, [reload])

  return {
    activities, deviceActions, metrics, taskBars,
    taskOutcomes, executionTimes, successRate, rateMetrics, rateError, loading, error, reload,
  }
}
