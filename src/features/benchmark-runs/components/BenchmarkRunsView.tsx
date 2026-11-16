import { TableIdentifier } from "@/components/shared/TableIdentifier"
import { TableTimestamp } from "@/components/shared/TableTimestamp"
import { MoreMenu } from "@/components/shared/MoreMenu"
import { useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import { CheckCircle2, Eye, ListChecks, Play, ShieldAlert } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  DataTable,
  DataTableContent,
  DataTableDateRangeFilter,
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
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import type { BenchmarkRun } from "@/service"
import { benchmarkChatPath } from "@/features/benchmark-scenarios/utils/benchmark.util"
import { BenchmarkRunDetailsPanel } from "@/features/benchmark-runs/components/BenchmarkRunDetailsPanel"
import { useBenchmarkRunsData } from "../hooks/use-benchmark-runs-data"
import type { BenchmarkRunRow } from "../types/benchmark-run.type"
import { filterBenchmarkRuns, summarizeBenchmarkRuns } from "../utils/benchmark-run.util"

export function BenchmarkRunsView() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [createdRange, setCreatedRange] = useState<DateRange | undefined>()
  const [confirmCleanup, setConfirmCleanup] = useState(false)
  const selectedId = params.get("run")
  const { runs, loading, busy, error, refresh, cleanup } = useBenchmarkRunsData(
    t("benchmarkRuns.loadError"),
    t("benchmarks.errors.cleanup"),
  )

  // The run API exposes started_at rather than created_at. The backend sets
  // started_at when creating the run, so filter by that timestamp in local time.
  // End is exclusive at the next local midnight: includes the entire last day.
  const rows = useMemo<BenchmarkRunRow[]>(
    () => filterBenchmarkRuns(runs, createdRange),
    [runs, createdRange],
  )

  // Keep the details panel aligned with the date-filtered rows.
  const selectedRun = rows.find((run) => run.id === selectedId) ?? rows[0] ?? null

  const summary = summarizeBenchmarkRuns(runs)

  function chooseRun(run: BenchmarkRun) {
    if (busy) return
    setParams({ run: run.id })
    setConfirmCleanup(false)
  }

  async function confirmAndCleanup() {
    if (!confirmCleanup || !selectedRun?.cleanup_required || busy) return
    if (await cleanup(selectedRun.id)) setConfirmCleanup(false)
  }

  if (loading) {
    return (
      <PageLoadingSkeleton
        title={t("benchmarkRuns.title")}
        description={t("benchmarkRuns.description")}
        variant="split"
        stats={4}
      />
    )
  }

  return (
    <PageLayout>
      <PageLayoutHeader title={t("benchmarkRuns.title")} description={t("benchmarkRuns.description")}>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => void refresh()}>
          {t("benchmarkRuns.refresh")}
        </Button>
      </PageLayoutHeader>
      <PageLayoutOverview>
        <PageLayoutStat
          label={t("benchmarks.stats.total.label")}
          value={summary.total}
          description={t("benchmarkRuns.stats.totalDescription")}
          icon={<ListChecks />}
        />
        <PageLayoutStat
          label={t("benchmarks.stats.inProgress.label")}
          value={summary.inProgress}
          description={t("benchmarkRuns.stats.inProgressDescription")}
          icon={<Play />}
        />
        <PageLayoutStat
          label={t("benchmarks.stats.completed.label")}
          value={summary.completed}
          description={t("benchmarkRuns.stats.completedDescription")}
          icon={<CheckCircle2 />}
          iconClassName="bg-emerald-500/10 text-emerald-400"
        />
        <PageLayoutStat
          label={t("benchmarks.stats.needsAttention.label")}
          value={summary.needsAttention}
          description={t("benchmarkRuns.stats.attentionDescription")}
          icon={<ShieldAlert />}
          iconClassName="bg-amber-500/10 text-amber-400"
        />
      </PageLayoutOverview>
      <PageLayoutContent className="space-y-4">
        {error && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.85fr)]">
          <div className="min-w-0 space-y-3">
            <DataTable
              data={rows}
              getRowId={(run) => run.id}
              searchValue={(run) =>
                `${run.scenario_name} ${run.id} ${run.scenario_id} ${run.task_id ?? ""} ${run.status}`
              }
              selectedRowId={selectedRun?.id}
              onRowClick={chooseRun}
              filters={[
                {
                  id: "runGroup",
                  label: t("benchmarkRuns.statusFilter"),
                  accessorKey: "runGroup",
                  allLabel: t("benchmarkRuns.filters.ALL"),
                  options: [
                    { value: "ACTIVE", label: t("benchmarkRuns.filters.ACTIVE") },
                    { value: "COMPLETED", label: t("benchmarkRuns.filters.COMPLETED") },
                    { value: "ATTENTION", label: t("benchmarkRuns.filters.ATTENTION") },
                  ],
                },
              ]}
              columns={[
                {
                  id: "scenario",
                  header: t("benchmarkRuns.table.scenario"),
                  headerClassName: "pl-4",
                  className: "min-w-48 pl-4",
                  cell: (run) => (
                    <div className="min-w-0">
                      <p className="max-w-64 truncate text-xs font-medium" title={run.scenario_name}>
                        {run.scenario_name}
                      </p>
                      <TableIdentifier value={run.id} className="mt-1 break-all text-[11px]" />
                    </div>
                  ),
                },
                {
                  id: "status",
                  header: t("benchmarkRuns.table.status"),
                  className: "min-w-32 pl-4",
                  cell: (run) => (
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge value={run.status} />
                      {run.cleanup_required && (
                        <span className="text-[11px] text-amber-500">
                          {t("benchmarkRuns.cleanupPending")}
                        </span>
                      )}
                    </div>
                  ),
                },
                {
                  id: "evaluation",
                  header: t("benchmarkRuns.evaluation"),
                  cell: (run) => run.evaluation_result
                    ? <StatusBadge value={run.evaluation_result} />
                    : <span className="text-xs text-muted-foreground">—</span>,
                },
                {
                  id: "timestamp",
                  header: t("benchmarkRuns.table.timestamp"),
                  className: "min-w-44 text-muted-foreground",
                  cell: (run) => (
                    <TableTimestamp
                      items={[
                        { label: t("benchmarkRuns.started"), value: run.started_at },
                        { label: t("benchmarkRuns.completed"), value: run.completed_at },
                        { label: t("benchmarkRuns.cleanedAt"), value: run.cleaned_at },
                      ]}
                    />
                  ),
                },
                {
                  id: "actions",
                  header: null,
                  headerClassName: "w-12 px-2 text-right",
                  className: "w-12 px-2 text-right",
                  cell: (run) => (
                    <div
                      className="flex justify-end"
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      {run.evaluation_id && run.task_id ? (
                        <MoreMenu
                          actions={[{
                            id: "view-evaluation",
                            label: t("benchmarkRuns.viewEvaluation"),
                            icon: <Eye className="size-4" />,
                            onClick: () => {
                              if (run.task_id) {
                                navigate(`/evaluations?task=${encodeURIComponent(run.task_id)}`)
                              }
                            },
                          }]}
                        />
                      ) : (
                        <span className="px-2 text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  ),
                },
              ]}
            >
              <DataTablePanel>
                <DataTableToolbar className="gap-2 sm:flex-row sm:flex-nowrap sm:items-center [&_[data-slot=data-table-search]]:min-w-0 [&_[data-slot=data-table-search]]:flex-1">
                  <DataTableSearch placeholder={t("benchmarkRuns.search")} />
                  <DataTableToolbarActions className="shrink-0 sm:flex-nowrap">
                    <DataTableDateRangeFilter
                      label="Created at"
                      value={createdRange}
                      onChange={setCreatedRange}
                      className="w-44"
                    />
                    <DataTableFilters />
                  </DataTableToolbarActions>
                </DataTableToolbar>
                <DataTableContent emptyMessage="benchmarkRuns.empty" />
                <DataTablePagination itemLabel="runs" />
              </DataTablePanel>
            </DataTable>
            <p className="text-xs text-muted-foreground">
              Loaded all {runs.length} benchmark runs. Created at filters the complete history
              using the run start timestamp.
            </p>
          </div>

          <div className="min-w-0">
            <BenchmarkRunDetailsPanel
              run={selectedRun}
              busy={busy}
              confirmCleanup={confirmCleanup}
              onOpenChat={() => {
                if (selectedRun) {
                  navigate(benchmarkChatPath(selectedRun.id, selectedRun.initial_message))
                }
              }}
              onRequestCleanup={() => setConfirmCleanup(true)}
              onCancelCleanup={() => setConfirmCleanup(false)}
              onConfirmCleanup={() => void confirmAndCleanup()}
            />
          </div>
        </div>
      </PageLayoutContent>
    </PageLayout>
  )
}
