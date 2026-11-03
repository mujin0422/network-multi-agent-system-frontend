import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ApiError, benchmarksApi } from "@/service"
import type { BenchmarkRun, BenchmarkScenario, BenchmarkScenarioCreate, BenchmarkScenarioUpdate } from "@/service"
import { benchmarkErrorMessage } from "../utils/benchmark.util"

/** Quản lý dữ liệu và các thao tác API của trang GNS3 Benchmarks. */
export function useBenchmarksData() {
  const { t } = useTranslation()
  const [scenarios, setScenarios] = useState<BenchmarkScenario[]>([])
  const [runs, setRuns] = useState<BenchmarkRun[]>([])
  const [selectedRun, setSelectedRun] = useState<BenchmarkRun | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [runsLoadFailed, setRunsLoadFailed] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    // A failed run-history request must not hide the scenarios (and vice versa).
    const [scenarioResult, runResult] = await Promise.allSettled([
      benchmarksApi.listScenarios(),
      benchmarksApi.listRuns(100),
    ])

    const messages: string[] = []
    const describeFailure = (endpoint: string, reason: unknown) => {
      const detail = benchmarkErrorMessage(reason, t("benchmarks.errors.load"))
      const status = reason instanceof ApiError && reason.status !== null
        ? `HTTP ${reason.status}: `
        : ""
      const hint = reason instanceof ApiError && reason.status === null
        ? ` ${t("benchmarks.errors.connectionHint")}`
        : ""
      return `${endpoint}: ${status}${detail}.${hint}`
    }

    if (scenarioResult.status === "fulfilled") {
      setScenarios(scenarioResult.value)
    } else {
      messages.push(describeFailure("GET /benchmarks/scenarios", scenarioResult.reason))
    }

    if (runResult.status === "fulfilled") {
      setRuns(runResult.value)
      setRunsLoadFailed(false)
    } else {
      // Without run history, we cannot safely check for pending lab cleanup.
      setRunsLoadFailed(true)
      messages.push(describeFailure("GET /benchmarks/runs", runResult.reason))
    }

    setError(messages.length > 0 ? messages.join("\n") : null)
    setLoading(false)
  }, [t])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reload() }, [reload])

  const createScenario = useCallback(async (payload: BenchmarkScenarioCreate) => {
    setError(null)
    try {
      const created = await benchmarksApi.createScenario(payload)
      setScenarios((current) => [created, ...current])
    } catch (reason) {
      const message = benchmarkErrorMessage(reason, t("benchmarks.errors.create"))
      setError(message)
      throw new Error(message, { cause: reason })
    }
  }, [t])

  const updateScenario = useCallback(async (scenarioId: string, payload: BenchmarkScenarioUpdate) => {
    setError(null)
    try {
      const updated = await benchmarksApi.updateScenario(scenarioId, payload)
      setScenarios((current) => current.map((item) => item.id === updated.id ? updated : item))
    } catch (reason) {
      const message = benchmarkErrorMessage(reason, t("benchmarks.errors.update"))
      setError(message)
      throw new Error(message, { cause: reason })
    }
  }, [t])

  const startScenario = useCallback(async (scenarioId: string) => {
    setBusy(true)
    setError(null)
    try {
      const nextRun = await benchmarksApi.start(scenarioId)
      setSelectedRun(nextRun)
      setRuns((current) => [nextRun, ...current])
      return nextRun
    } catch (reason) {
      setError(benchmarkErrorMessage(reason, t("benchmarks.errors.start")))
    } finally {
      setBusy(false)
    }
  }, [t])

  const cleanupRun = useCallback(async (runId: string) => {
    setBusy(true)
    setError(null)
    try {
      const cleaned = await benchmarksApi.cleanup(runId)
      setSelectedRun(cleaned)
      setRuns((current) => current.map((item) => item.id === cleaned.id ? cleaned : item))
    } catch (reason) {
      setError(benchmarkErrorMessage(reason, t("benchmarks.errors.cleanup")))
    } finally {
      setBusy(false)
    }
  }, [t])

  const toggleScenario = useCallback(async (scenario: BenchmarkScenario) => {
    setBusy(true)
    setError(null)
    try {
      const updated = await benchmarksApi.updateScenario(scenario.id, {
        is_active: !scenario.is_active,
      })
      setScenarios((current) => current.map((item) => item.id === updated.id ? updated : item))
    } catch (reason) {
      setError(benchmarkErrorMessage(reason, t("benchmarks.errors.update")))
    } finally {
      setBusy(false)
    }
  }, [t])

  const summary = useMemo(() => ({
    total: runs.length,
    inProgress: runs.filter((run) => ["PREPARING", "READY", "RUNNING"].includes(run.status)).length,
    completed: runs.filter((run) => ["COMPLETED", "CLEANED"].includes(run.status)).length,
    needsAttention: runs.filter((run) => run.status === "FAILED" || run.cleanup_required).length,
  }), [runs])

  return {
    scenarios,
    runs,
    runsLoadFailed,
    selectedRun,
    loading,
    busy,
    error,
    summary,
    setSelectedRun,
    reload,
    createScenario,
    updateScenario,
    startScenario,
    cleanupRun,
    toggleScenario,
  }
}
