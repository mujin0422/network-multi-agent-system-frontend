import { useCallback, useEffect, useState } from "react"

import { benchmarkRunsApi } from "../api/benchmark-runs.api"
import type { BenchmarkRun } from "@/service"

export function useBenchmarkRunsData(loadError: string, cleanupError: string) {
  const [runs, setRuns] = useState<BenchmarkRun[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      setRuns(await benchmarkRunsApi.listAll())
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : loadError)
    } finally {
      setLoading(false)
    }
  }, [loadError])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- tải dữ liệu sau khi feature được gắn vào giao diện.
  useEffect(() => { void refresh() }, [refresh])

  const cleanup = useCallback(async (runId: string) => {
    setBusy(true)
    setError(null)
    try {
      const updated = await benchmarkRunsApi.cleanup(runId)
      setRuns((current) => current.map((run) => run.id === updated.id ? updated : run))
      return true
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : cleanupError)
      return false
    } finally {
      setBusy(false)
    }
  }, [cleanupError])

  return { runs, loading, busy, error, refresh, cleanup }
}
