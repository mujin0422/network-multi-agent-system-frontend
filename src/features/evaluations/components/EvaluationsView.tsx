import { TableIdentifier } from "@/components/shared/TableIdentifier"
import { TableTimestamp } from "@/components/shared/TableTimestamp"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Bot, ClipboardCheck, Clock3, Eye, History, Wrench } from "lucide-react"

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
import { EvaluationDetailsSheet } from "./EvaluationDetailsSheet"
import { useEvaluationsData } from "../hooks/use-evaluations-data"
import type { EvaluationTableRow } from "../types/evaluation.type"
import { buildEvaluationRows, calculateEvaluationMetrics } from "../utils/evaluation.util"

export function EvaluationsView() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { evaluations, runs, tasks, usersById, loading, error, refresh } = useEvaluationsData(
    t("evaluationsPage.loadError"),
  )
  const detailTaskId = params.get("task")

  const rows = useMemo<EvaluationTableRow[]>(
    () => buildEvaluationRows(
      evaluations,
      runs,
      tasks,
      usersById,
      t("evaluationsPage.taskEvaluation"),
    ),
    [evaluations, runs, tasks, usersById, t],
  )
  const {
    countAutomated,
    latencySamples,
    interactionSamples,
    averageLatency,
    averageInteractions,
  } = calculateEvaluationMetrics(evaluations)

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
    return <PageLoadingSkeleton title={t("evaluationsPage.title")} description={t("evaluationsPage.description")} variant="table" stats={4} />
  }

  return (
    <PageLayout>
      <PageLayoutHeader title={t("evaluationsPage.title")} description={t("evaluationsPage.description")}>
        <Button size="sm" variant="outline" onClick={() => void refresh()}>{t("evaluationsPage.refresh")}</Button>
      </PageLayoutHeader>
      <PageLayoutOverview>
        <PageLayoutStat
          label={t("evaluationsPage.total")}
          value={evaluations.length}
          description={t("evaluationsPage.stats.totalDescription")}
          icon={<ClipboardCheck />}
        />
        <PageLayoutStat
          label={t("evaluationsPage.stats.automated")}
          value={countAutomated}
          description={t("evaluationsPage.stats.automatedDescription")}
          icon={<Bot />}
        />
        <PageLayoutStat
          label={t("evaluationsPage.averageLatency")}
          value={averageLatency == null ? "—" : `${averageLatency.toFixed(2)} s`}
          description={t("evaluationsPage.measuredSamples", { count: latencySamples.length })}
          icon={<Clock3 />}
        />
        <PageLayoutStat
          label={t("evaluationsPage.averageTurns")}
          value={averageInteractions == null ? "—" : averageInteractions.toFixed(1)}
          description={t("evaluationsPage.measuredSamples", { count: interactionSamples.length })}
          icon={<Wrench />}
        />
      </PageLayoutOverview>
      <PageLayoutContent>
        {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{error}</p>}
        <DataTable
          data={rows}
          getRowId={(evaluation) => evaluation.id}
          searchValue={(evaluation) =>
            `${evaluation.task_id} ${evaluation.id} ${evaluation.scenarioName} ${evaluation.evaluator_type} ${evaluation.ownerId ?? ""} ${evaluation.ownerName ?? ""} ${evaluation.ownerEmail ?? ""}`
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
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="max-w-64 truncate text-xs font-medium" title={evaluation.scenarioName}>
                      {evaluation.scenarioName}
                    </p>
                    {evaluation.evaluation_status !== "COMPLETED" && (
                      <StatusBadge value={evaluation.evaluation_status} />
                    )}
                  </div>
                  <p className="mt-1 type-caption text-muted-foreground">
                    Task: <TableIdentifier value={evaluation.task_id} variant="reference" inline />
                  </p>
                </div>
              ),
            },
            {
              id: "owner",
              header: "Owner",
              className: "min-w-36 max-w-48",
              cell: (evaluation) => (
                <div className="min-w-0">
                  <p
                    className="max-w-44 truncate text-xs font-medium"
                    title={evaluation.ownerName ?? evaluation.ownerId ?? undefined}
                  >
                    {evaluation.ownerName ?? evaluation.ownerId ?? "—"}
                  </p>
                  {evaluation.ownerEmail && (
                    <p className="mt-1 max-w-44 truncate text-[11px] text-muted-foreground" title={evaluation.ownerEmail}>
                      {evaluation.ownerEmail}
                    </p>
                  )}
                </div>
              ),
            },
            {
              id: "evaluatorType",
              header: "Evaluator Type",
              className: "whitespace-nowrap",
              cell: (evaluation) => (
                <span className="text-xs font-medium">{evaluation.evaluator_type}</span>
              ),
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
              id: "rcaF1",
              header: t("evaluationsPage.rcaF1"),
              cell: (evaluation) => {
                const f1 = evaluation.scores?.rca_f1
                return (
                  <span className="text-xs tabular-nums">
                    {f1 == null ? "—" : `${(f1 * 100).toFixed(1)}%`}
                  </span>
                )
              },
            },
            {
              id: "timestamp",
              header: t("evaluationsPage.evaluatedAt"),
              className: "whitespace-nowrap text-muted-foreground",
              cell: (evaluation) => (
                <TableTimestamp
                  items={[{ label: t("evaluationsPage.evaluatedAt"), value: evaluation.evaluated_at }]}
                />
              ),
            },
            {
              id: "actions",
              header: null,
              headerClassName: "w-12 px-2 text-right",
              className: "w-12 px-2 text-right",
              cell: (evaluation) => {
                const runId = evaluation.run?.id
                return (
                  <div className="flex w-full justify-end">
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
                  </div>
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
      <EvaluationDetailsSheet
        open={Boolean(detailTaskId)}
        taskId={detailTaskId}
        onOpenChange={closeDetails}
      />
    </PageLayout>
  )
}
