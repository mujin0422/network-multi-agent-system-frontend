import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Eye, History } from "lucide-react"

import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
} from "@/components/shared/DataTable"
import {
  PageLayout, PageLayoutContent, PageLayoutHeader, PageLayoutOverview, PageLayoutStat,
} from "@/components/shared/PageLayout"
import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { MoreMenu } from "@/components/shared/MoreMenu"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import { BenchmarkEvaluationSheet } from "@/features/benchmarks/components/BenchmarkEvaluationSheet"
import { benchmarksApi, evaluationsApi } from "@/service"
import type { BenchmarkRun, EvaluationResult, TaskEvaluationSummary } from "@/service"

type EvaluationTableRow = TaskEvaluationSummary & {
  scenarioName: string
  run: BenchmarkRun | null
  rcaResult: EvaluationResult
}

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
    // Optional enrichment: associate evaluations with recent benchmark runs.
    if (runResult.status === "fulfilled") setRuns(runResult.value)
    setLoading(false)
  }, [t])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch after mount.
  useEffect(() => { void refresh() }, [refresh])

  const rows = useMemo<EvaluationTableRow[]>(() => {
    const byTask = new Map(
      runs.flatMap((run) => run.task_id ? [[run.task_id, run] as const] : []),
    )
    return evaluations.map((evaluation) => {
      const run = byTask.get(evaluation.task_id) ?? null
      return {
        ...evaluation,
        run,
        scenarioName: run?.scenario_name ?? t("evaluationsPage.taskEvaluation"),
        rcaResult: evaluation.results.RCA ?? "UNKNOWN",
      }
    })
  }, [evaluations, runs, t])

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
    return <PageLoadingSkeleton title={t("evaluationsPage.title")} description={t("evaluationsPage.description")} variant="table" stats={3} />
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
      <PageLayoutContent>
        {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{error}</p>}
        <DataTable
          data={rows}
          getRowId={(evaluation) => evaluation.id}
          searchValue={(evaluation) =>
            `${evaluation.task_id} ${evaluation.id} ${evaluation.scenarioName} ${evaluation.evaluator_type} ${evaluation.evaluator_version ?? ""}`
          }
          filters={[
            {
              id: "rca",
              label: "RCA",
              accessorKey: "rcaResult",
              allLabel: t("evaluationsPage.filters.ALL"),
              options: [
                { value: "PASS", label: t("evaluationsPage.filters.PASS") },
                { value: "FAIL", label: t("evaluationsPage.filters.FAIL") },
              ],
            },
          ]}
          columns={[
            {
              id: "scenario",
              header: t("evaluationsPage.scenario"),
              headerClassName: "pl-4",
              className: "min-w-56 pl-4",
              cell: (evaluation) => (
                <div className="min-w-0">
                  <p className="max-w-64 truncate text-xs font-medium" title={evaluation.scenarioName}>
                    {evaluation.scenarioName}
                  </p>
                  <p className="mt-1 break-all font-mono type-caption text-muted-foreground" title={evaluation.task_id}>
                    {evaluation.task_id}
                  </p>
                </div>
              ),
            },
            {
              id: "status",
              header: t("evaluationsPage.status"),
              cell: (evaluation) => <StatusBadge value={evaluation.evaluation_status} />,
            },
            {
              id: "goal",
              header: "GOAL",
              cell: (evaluation) => <StatusBadge value={evaluation.results.GOAL ?? "UNKNOWN"} />,
            },
            {
              id: "rca",
              header: "RCA",
              cell: (evaluation) => <StatusBadge value={evaluation.rcaResult} />,
            },
            {
              id: "remediation",
              header: "REMEDIATION",
              cell: (evaluation) => <StatusBadge value={evaluation.results.REMEDIATION ?? "UNKNOWN"} />,
            },
            {
              id: "safety",
              header: "SAFETY",
              cell: (evaluation) => <StatusBadge value={evaluation.results.SAFETY ?? "UNKNOWN"} />,
            },
            {
              id: "evaluator",
              header: t("evaluationsPage.evaluator"),
              className: "min-w-36 text-xs",
              cell: (evaluation) => (
                <div>
                  <p className="font-medium">{evaluation.evaluator_type}</p>
                  <p className="mt-1 text-muted-foreground">{evaluation.evaluator_version ?? "—"}</p>
                </div>
              ),
            },
            {
              id: "evaluated",
              header: t("evaluationsPage.evaluatedAt"),
              className: "min-w-36 text-xs text-muted-foreground",
              cell: (evaluation) => readableTime(evaluation.evaluated_at ?? evaluation.created_at),
            },
            {
              id: "actions",
              header: t("evaluationsPage.actions"),
              className: "whitespace-nowrap",
              cell: (evaluation) => {
                const runId = evaluation.run?.id
                return (
                  <MoreMenu
                    actions={[
                      ...(runId
                        ? [{
                            id: "view-run",
                            label: t("evaluationsPage.viewRun"),
                            icon: <History className="size-4" />,
                            onClick: () => navigate(
                              `/benchmark-runs?run=${encodeURIComponent(runId)}`,
                            ),
                          }]
                        : []),
                      {
                        id: "view-details",
                        label: t("evaluationsPage.viewDetails"),
                        icon: <Eye className="size-4" />,
                        onClick: () => openDetails(evaluation.task_id),
                      },
                    ]}
                  />
                )
              },
            },
          ]}
        >
          <DataTablePanel>
            <DataTableToolbar>
              <DataTableSearch placeholder={t("evaluationsPage.search")} />
              <DataTableToolbarActions>
                <DataTableFilters />
              </DataTableToolbarActions>
            </DataTableToolbar>
            <DataTableContent emptyMessage="evaluationsPage.empty" />
            <DataTablePagination itemLabel="evaluations" />
          </DataTablePanel>
        </DataTable>
        <p className="mt-3 text-xs text-muted-foreground">{t("evaluationsPage.latestLimit")}</p>
      </PageLayoutContent>
      <BenchmarkEvaluationSheet
        open={Boolean(detailTaskId)}
        taskId={detailTaskId}
        onOpenChange={closeDetails}
      />
    </PageLayout>
  )
}
