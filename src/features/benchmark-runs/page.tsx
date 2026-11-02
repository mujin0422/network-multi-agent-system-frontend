import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  PageLayout, PageLayoutContent, PageLayoutHeader, PageLayoutOverview, PageLayoutStat,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { benchmarksApi } from "@/service"
import type { BenchmarkRun } from "@/service"
import { BenchmarkCurrentRun } from "@/features/benchmarks/components/BenchmarkCurrentRun"
import { BenchmarkRunHistory } from "@/features/benchmarks/components/BenchmarkRunHistory"
import { benchmarkChatPath } from "@/features/benchmarks/utils/benchmark.util"

type RunFilter = "ALL" | "ACTIVE" | "COMPLETED" | "ATTENTION"

export default function BenchmarkRunsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [runs, setRuns] = useState<BenchmarkRun[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<RunFilter>("ALL")
  const [confirmCleanup, setConfirmCleanup] = useState(false)
  const selectedId = params.get("run")

  const refresh = useCallback(async () => {
    setError(null)
    try {
      setRuns(await benchmarksApi.listRuns(100))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("benchmarkRuns.loadError"))
    } finally {
      setLoading(false)
    }
  }, [t])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch after mount.
  useEffect(() => { void refresh() }, [refresh])

  const rows = useMemo(() => runs.filter((run) => {
    const textMatch = [run.id, run.scenario_name, run.scenario_id, run.task_id ?? ""]
      .some((value) => value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    if (!textMatch) return false
    if (filter === "ACTIVE") return ["PREPARING", "READY", "RUNNING"].includes(run.status)
    if (filter === "COMPLETED") return ["COMPLETED", "CLEANED"].includes(run.status)
    if (filter === "ATTENTION") return run.status === "FAILED" || run.cleanup_required
    return true
  }), [runs, query, filter])
  const selectedRun = rows.find((run) => run.id === selectedId) ?? rows[0] ?? null

  const summary = {
    total: runs.length,
    inProgress: runs.filter((run) => ["PREPARING", "READY", "RUNNING"].includes(run.status)).length,
    completed: runs.filter((run) => ["COMPLETED", "CLEANED"].includes(run.status)).length,
    needsAttention: runs.filter((run) => run.status === "FAILED" || run.cleanup_required).length,
  }

  function chooseRun(run: BenchmarkRun) {
    setParams({ run: run.id })
    setConfirmCleanup(false)
  }

  async function confirmAndCleanup() {
    if (!selectedRun || !selectedRun.cleanup_required || busy) return
    setBusy(true)
    setError(null)
    try {
      const updated = await benchmarksApi.cleanup(selectedRun.id)
      setRuns((current) => current.map((run) => run.id === updated.id ? updated : run))
      setConfirmCleanup(false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("benchmarks.errors.cleanup"))
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <PageLoadingSkeleton title={t("benchmarkRuns.title")} description={t("benchmarkRuns.description")} variant="table" stats={4} />
  }

  return (
    <PageLayout>
      <PageLayoutHeader title={t("benchmarkRuns.title")} description={t("benchmarkRuns.description")}>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => void refresh()}>{t("benchmarkRuns.refresh")}</Button>
      </PageLayoutHeader>
      <PageLayoutOverview>
        <PageLayoutStat label={t("benchmarks.stats.total.label")} value={summary.total} />
        <PageLayoutStat label={t("benchmarks.stats.inProgress.label")} value={summary.inProgress} />
        <PageLayoutStat label={t("benchmarks.stats.completed.label")} value={summary.completed} />
        <PageLayoutStat label={t("benchmarks.stats.needsAttention.label")} value={summary.needsAttention} />
      </PageLayoutOverview>
      <PageLayoutContent className="space-y-4">
        {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{error}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-sm"
            aria-label={t("benchmarkRuns.search")}
            placeholder={t("benchmarkRuns.search")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {(["ALL", "ACTIVE", "COMPLETED", "ATTENTION"] as const).map((value) => (
            <Button
              key={value}
              size="sm"
              variant={filter === value ? "secondary" : "ghost"}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {t(`benchmarkRuns.filters.${value}`)}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t("benchmarkRuns.latestLimit")}</p>
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <BenchmarkRunHistory runs={rows} onSelect={chooseRun} selectedRunId={selectedRun?.id} />
          <div className="min-w-0 space-y-3">
            {selectedRun ? (
              <>
                <BenchmarkCurrentRun
                  run={selectedRun}
                  busy={busy}
                  onOpenChat={() => navigate(benchmarkChatPath(selectedRun.id, selectedRun.initial_message))}
                  onCleanup={() => setConfirmCleanup(true)}
                  onViewEvaluation={() => {
                    if (selectedRun.task_id) navigate(`/evaluations?task=${encodeURIComponent(selectedRun.task_id)}`)
                  }}
                />
                {confirmCleanup && selectedRun.cleanup_required && (
                  <Card size="sm" className="border-amber-500/40">
                    <CardContent className="space-y-3">
                      <p className="text-xs">{t("benchmarkRuns.cleanupWarning")}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => setConfirmCleanup(false)} disabled={busy}>
                          {t("benchmarkRuns.cancel")}
                        </Button>
                        <Button size="sm" variant="destructive" disabled={busy} onClick={() => void confirmAndCleanup()}>
                          {t("benchmarkRuns.confirmCleanup")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card size="sm">
                  <CardContent className="space-y-2 text-xs">
                    <p><span className="text-muted-foreground">{t("benchmarkRuns.scenarioVersion")}: </span>{selectedRun.scenario_version}</p>
                    <p className="break-all"><span className="text-muted-foreground">Task ID: </span>{selectedRun.task_id ?? "—"}</p>
                    <p className="break-all"><span className="text-muted-foreground">Conversation ID: </span>{selectedRun.conversation_id ?? "—"}</p>
                    <p><span className="text-muted-foreground">{t("benchmarkRuns.started")}: </span>{new Date(selectedRun.started_at).toLocaleString()}</p>
                    {selectedRun.completed_at && (
                      <p><span className="text-muted-foreground">{t("benchmarkRuns.completed")}: </span>{new Date(selectedRun.completed_at).toLocaleString()}</p>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card size="sm"><CardContent className="text-xs text-muted-foreground">{t("benchmarkRuns.empty")}</CardContent></Card>
            )}
          </div>
        </div>
      </PageLayoutContent>
    </PageLayout>
  )
}
