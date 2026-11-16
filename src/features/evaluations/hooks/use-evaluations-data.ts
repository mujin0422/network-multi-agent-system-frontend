import { useCallback, useEffect, useState } from "react"

import { benchmarkRunsApi } from "@/features/benchmark-runs/api/benchmark-runs.api"
import { tasksApi } from "@/features/tasks/api/tasks.api"
import { usersApi } from "@/features/users/api/users.api"
import { evaluationsApi } from "../api/evaluations.api"
import type { BenchmarkRun, Task, TaskEvaluationSummary, User } from "@/service"

export function useEvaluationsData(loadError: string) {
  const [evaluations, setEvaluations] = useState<TaskEvaluationSummary[]>([])
  const [runs, setRuns] = useState<BenchmarkRun[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [usersById, setUsersById] = useState<Map<string, User>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    const [evaluationResult, runResult, taskResult, userResult] = await Promise.allSettled([
      evaluationsApi.list(100),
      benchmarkRunsApi.listAll(),
      tasksApi.list(),
      usersApi.list(),
    ])
    if (evaluationResult.status === "fulfilled") setEvaluations(evaluationResult.value)
    else setError(evaluationResult.reason instanceof Error ? evaluationResult.reason.message : loadError)
    setRuns(runResult.status === "fulfilled" ? runResult.value : [])
    setTasks(taskResult.status === "fulfilled" ? taskResult.value : [])
    setUsersById(userResult.status === "fulfilled"
      ? new Map(userResult.value.map((user) => [user.id, user]))
      : new Map())
    setLoading(false)
  }, [loadError])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- tải dữ liệu sau khi feature được gắn vào giao diện.
  useEffect(() => { void refresh() }, [refresh])

  return { evaluations, runs, tasks, usersById, loading, error, refresh }
}
