import { useCallback, useEffect, useMemo, useState } from "react"
import { CheckCircle2, ListChecks, Play, ShieldAlert } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"

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
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import { benchmarksApi } from "@/service"
import type { BenchmarkRun } from "@/service"
import { benchmarkChatPath } from "@/features/benchmarks/utils/benchmark.util"
import { BenchmarkRunDetailsPanel } from "./components/BenchmarkRunDetailsPanel"

type RunGroup = "ACTIVE" | "COMPLETED" | "ATTENTION"
type BenchmarkRunRow = BenchmarkRun & { runGroup: RunGroup }

function groupRun(run: BenchmarkRun): RunGroup {
  if (run.status === "FAILED" || run.cleanup_required) return "ATTENTION"
  if (["PREPARING", "READY", "RUNNING"].includes(run.status)) return "ACTIVE"
  return "COMPLETED"
}

function displayTime(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString()
}

export default function BenchmarkRunsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [runs, setRuns] = useState<BenchmarkRun[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const rows = useMemo<BenchmarkRunRow[]>(
    () => runs.map((run) => ({ ...run, runGroup: groupRun(run) })),
    [runs],
  )
  const selectedRun = runs.find((run) => run.id === selectedId) ?? runs[0] ?? null

  const summary = {
    total: runs.length,
    inProgress: runs.filter((run) => ["PREPARING", "READY", "RUNNING"].includes(run.status)).length,
    completed: runs.filter((run) => ["COMPLETED", "CLEANED"].includes(run.status)).length,
    needsAttention: runs.filter((run) => run.status === "FAILED" || run.cleanup_required).length,
  }

  function chooseRun(run: BenchmarkRun) {
    if (busy) return
    setParams({ run: run.id })
    setConfirmCleanup(false)
  }

  async function confirmAndCleanup() {
    if (!confirmCleanup || !selectedRun?.cleanup_required || busy) return
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
                      <p className="mt-1 break-all font-mono text-[11px] text-identifier">
                        {run.id}
                      </p>
                    </div>
                  ),
                },
                {
                  id: "status",
                  header: t("benchmarkRuns.table.status"),
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
                  id: "task",
                  header: "Task ID",
                  className: "min-w-36 max-w-44",
                  cell: (run) => (
                    <span className={`block max-w-40 truncate font-mono text-[11px] ${run.task_id ? "text-identifier" : "text-muted-foreground"}`} title={run.task_id ?? undefined}>
                      {run.task_id ?? "—"}
                    </span>
                  ),
                },
                {
                  id: "started",
                  header: t("benchmarkRuns.started"),
                  className: "min-w-32 text-xs text-muted-foreground",
                  cell: (run) => displayTime(run.started_at),
                },
              ]}
            >
              <DataTablePanel>
                <DataTableToolbar>
                  <DataTableSearch placeholder={t("benchmarkRuns.search")} />
                  <DataTableToolbarActions>
                    <DataTableFilters />
                  </DataTableToolbarActions>
                </DataTableToolbar>
                <DataTableContent emptyMessage="benchmarkRuns.empty" />
                <DataTablePagination itemLabel="runs" />
              </DataTablePanel>
            </DataTable>
            <p className="text-xs text-muted-foreground">{t("benchmarkRuns.latestLimit")}</p>
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
              onViewEvaluation={() => {
                if (selectedRun?.task_id) {
                  navigate(`/evaluations?task=${encodeURIComponent(selectedRun.task_id)}`)
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
