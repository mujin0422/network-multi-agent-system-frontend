import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  PageLayout, PageLayoutContent, PageLayoutHeader, PageLayoutOverview, PageLayoutStat,
} from "@/components/shared/PageLayout"
import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BenchmarkEvaluationSheet } from "@/features/benchmarks/components/BenchmarkEvaluationSheet"
import { benchmarksApi, evaluationsApi } from "@/service"
import type { BenchmarkRun, EvaluationMetricType, TaskEvaluationSummary } from "@/service"

type ResultFilter = "ALL" | "PASS" | "FAIL"
const METRIC_ORDER: EvaluationMetricType[] = ["GOAL", "RCA", "REMEDIATION", "SAFETY"]

function readableTime(value: string | null): string {
  if (!value) return "—"
  const timestamp = new Date(value)
  return Number.isNaN(timestamp.getTime()) ? value : timestamp.toLocaleString()
}

export default function EvaluationsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [evaluations, setEvaluations] = useState<TaskEvaluationSummary[]>([])
  const [runs, setRuns] = useState<BenchmarkRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [resultFilter, setResultFilter] = useState<ResultFilter>("ALL")
  const detailTaskId = params.get("task")

  const refresh = useCallback(async () => {
    setError(null)
    const [evaluationResult, runResult] = await Promise.allSettled([
      evaluationsApi.list(100),
      benchmarksApi.listRuns(100),
    ])
    if (evaluationResult.status === "fulfilled") {
      setEvaluations(evaluationResult.value)
    } else {
      setError(evaluationResult.reason instanceof Error
        ? evaluationResult.reason.message
        : t("evaluationsPage.loadError"))
    }
    // Optional enrichment: show benchmark names when the matching run is in the latest 100.
    if (runResult.status === "fulfilled") setRuns(runResult.value)
    setLoading(false)
  }, [t])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch after mount.
  useEffect(() => { void refresh() }, [refresh])

  const byTask = useMemo(
    () => new Map(runs.flatMap((run) =>
      run.task_id ? [[run.task_id, run] as const] : [],
    )),
    [runs],
  )
  const rows = useMemo(() => evaluations.filter((evaluation) => {
    const matchingRun = byTask.get(evaluation.task_id)
    const matchesText = [evaluation.task_id, evaluation.id, matchingRun?.scenario_name ?? ""]
      .some((value) => value.toLowerCase().includes(query.trim().toLowerCase()))
    return matchesText &&
      (resultFilter === "ALL" || evaluation.results.RCA === resultFilter)
  }), [evaluations, byTask, query, resultFilter])

  const countPass = evaluations.filter((evaluation) => evaluation.results.RCA === "PASS").length
  const countFail = evaluations.filter((evaluation) => evaluation.results.RCA === "FAIL").length

  function openDetails(taskId: string) {
    setParams({ task: taskId })
  }

  function closeDetails(isOpen: boolean) {
    if (!isOpen) {
      const nextParams = new URLSearchParams(params)
      nextParams.delete("task")
      setParams(nextParams, { replace: true })
    }
  }

  if (loading) {
    return <PageLoadingSkeleton title={t("evaluationsPage.title")} description={t("evaluationsPage.description")} variant="cards" stats={3} />
  }

  return (
    <PageLayout>
      <PageLayoutHeader title={t("evaluationsPage.title")} description={t("evaluationsPage.description")}>
        <Button size="sm" variant="outline" onClick={() => void refresh()}>{t("evaluationsPage.refresh")}</Button>
      </PageLayoutHeader>
      <PageLayoutOverview>
        <PageLayoutStat label={t("evaluationsPage.total")} value={evaluations.length} />
        <PageLayoutStat label={t("evaluationsPage.rcaPass")} value={countPass} />
        <PageLayoutStat label={t("evaluationsPage.rcaFail")} value={countFail} />
      </PageLayoutOverview>
      <PageLayoutContent className="space-y-4">
        {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{error}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-sm"
            aria-label={t("evaluationsPage.search")}
            placeholder={t("evaluationsPage.search")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {(["ALL", "PASS", "FAIL"] as const).map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={resultFilter === filter ? "secondary" : "ghost"}
              aria-pressed={resultFilter === filter}
              onClick={() => setResultFilter(filter)}
            >
              {t(`evaluationsPage.filters.${filter}`)}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t("evaluationsPage.latestLimit")}</p>
        {rows.length === 0 ? (
          <Card size="sm"><CardContent className="p-6 text-xs text-muted-foreground">{t("evaluationsPage.empty")}</CardContent></Card>
        ) : (
          <div className="grid min-w-0 gap-3 xl:grid-cols-2">
            {rows.map((evaluation) => {
              const run = byTask.get(evaluation.task_id)
              return (
                <Card key={evaluation.id} size="sm" className="min-w-0">
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <p className="truncate text-sm font-semibold">
                          {run?.scenario_name ?? t("evaluationsPage.taskEvaluation")}
                        </p>
                        <p className="break-all font-mono text-[11px] text-muted-foreground">{evaluation.task_id}</p>
                      </div>
                      <StatusBadge value={evaluation.evaluation_status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {METRIC_ORDER.map((metric) => (
                        <div key={metric} className="space-y-1 rounded-lg border p-2">
                          <p className="text-[11px] text-muted-foreground">{metric}</p>
                          <StatusBadge value={evaluation.results[metric] ?? "UNKNOWN"} />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                      <p className="text-xs text-muted-foreground">
                        {evaluation.evaluator_type} · {readableTime(evaluation.evaluated_at ?? evaluation.created_at)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {run && (
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/benchmark-runs?run=${encodeURIComponent(run.id)}`)}>
                            {t("evaluationsPage.viewRun")}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => openDetails(evaluation.task_id)}>
                          {t("evaluationsPage.viewDetails")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </PageLayoutContent>
      <BenchmarkEvaluationSheet
        open={Boolean(detailTaskId)}
        taskId={detailTaskId}
        onOpenChange={closeDetails}
      />
    </PageLayout>
  )
}
