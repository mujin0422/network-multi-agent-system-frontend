import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { benchmarksApi } from "@/service"
import type { BenchmarkRun, BenchmarkScenario, BenchmarkScenarioCreate } from "@/service"
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

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [scenarioRows, runRows] = await Promise.all([
        benchmarksApi.listScenarios(),
        benchmarksApi.listRuns(),
      ])
      setScenarios(scenarioRows)
      setRuns(runRows)
    } catch (reason) {
      setError(benchmarkErrorMessage(reason, t("benchmarks.errors.load")))
    } finally {
      setLoading(false)
    }
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

  const startScenario = useCallback(async (scenarioId: string) => {
    setBusy(true)
    setError(null)
    try {
      const nextRun = await benchmarksApi.start(scenarioId)
      setSelectedRun(nextRun)
      setRuns((current) => [nextRun, ...current])
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

  return {
    scenarios,
    runs,
    selectedRun,
    loading,
    busy,
    error,
    setSelectedRun,
    reload,
    createScenario,
    startScenario,
    cleanupRun,
    toggleScenario,
  }
}
