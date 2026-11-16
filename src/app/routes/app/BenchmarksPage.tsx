import { AlertTriangle, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { PageLayout, PageLayoutContent, PageLayoutHeader } from "@/components/shared/PageLayout"
import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { BenchmarkScenarioCard } from "@/features/benchmark-scenarios/components/BenchmarkScenarioCard"
import { BenchmarkScenarioForm } from "@/features/benchmark-scenarios/components/BenchmarkScenarioForm"
import { BENCHMARK_SCENARIOS_PER_PAGE } from "@/features/benchmark-scenarios/constants/benchmark-scenarios.constants"
import { useBenchmarkScenariosPage } from "@/features/benchmark-scenarios/hooks/use-benchmark-scenarios-page"

export default function BenchmarksPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    scenarios, runsLoadFailed, loading, busy, error, reload, startScenario, toggleScenario,
    createOpen, setCreateOpen, editingScenario, editingId, editError, formVersion,
    openCreateForm, openEditForm, saveScenario, existingRunNeedsAttention,
    scenarioPage, scenarioPageCount, scenarioPageItems, setScenarioPage,
    visibleScenarios, scenarioStartItem, scenarioEndItem,
  } = useBenchmarkScenariosPage()

  async function startAndOpenRun(scenarioId: string) {
    const run = await startScenario(scenarioId)
    if (run) navigate(`/benchmark-runs?run=${encodeURIComponent(run.id)}`)
  }

  if (loading) {
    return <PageLoadingSkeleton title={t("benchmarks.title")} description={t("benchmarks.description")} stats={4} variant="cards" />
  }

  return (
    <PageLayout>
      <PageLayoutHeader title={t("benchmarks.title")} description={t("benchmarks.description")}>
        <Button size="sm" variant="outline" onClick={() => navigate("/benchmark-runs")}>
          {t("benchmarkRuns.openRuns")}
        </Button>
        <Button size="sm" onClick={openCreateForm}>{t("benchmarks.addScenario")}</Button>
      </PageLayoutHeader>
      <PageLayoutContent className="space-y-6">
        <div className="grid grid-cols-[56px_minmax(0,1fr)] rounded-xl border border-amber-500/25 bg-amber-500/5 text-xs">
          <div className="grid place-items-center"><AlertTriangle className="size-5 text-amber-400" /></div>
          <div className="p-4">
            <p className="font-medium">{t("benchmarks.warningTitle")}</p>
            <p className="mt-1 text-muted-foreground">{t("benchmarks.warningDescription")}</p>
          </div>
        </div>
        {existingRunNeedsAttention && <p className="text-xs text-muted-foreground">{t("benchmarkRuns.activeWarning")}</p>}
        {(error || editError) && (
          <div role="alert" className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            <p className="min-w-0 flex-1 whitespace-pre-line break-words">{editError || error}</p>
            {error && (
              <Button type="button" variant="outline" size="xs" onClick={() => void reload()}>
                {t("benchmarks.retry")}
              </Button>
            )}
          </div>
        )}
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleScenarios.map((scenario) => (
            <BenchmarkScenarioCard
              key={scenario.id}
              scenario={scenario}
              busy={busy}
              startDisabled={busy || existingRunNeedsAttention || runsLoadFailed}
              editLoading={editingId === scenario.id}
              onEdit={(id) => void openEditForm(id)}
              onStart={(id) => void startAndOpenRun(id)}
              onToggle={(row) => void toggleScenario(row)}
            />
          ))}
        </div>
        {scenarios.length > 0 && (
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {scenarioStartItem.toLocaleString()}–{scenarioEndItem.toLocaleString()} {t("common.of")} {scenarios.length.toLocaleString()} {t("benchmarks.scenarios", { defaultValue: "scenarios" })}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{t("benchmarks.scenariosPerPage")}</span>
                <span className="flex h-8 w-20 items-center rounded-lg border border-border bg-background px-3 text-foreground">
                  {BENCHMARK_SCENARIOS_PER_PAGE}
                </span>
              </div>
              <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      aria-label={t("common.previous")}
                      aria-disabled={scenarioPage === 1}
                      tabIndex={scenarioPage === 1 ? -1 : 0}
                      className={`size-8 gap-1 p-0 sm:w-auto sm:px-3 ${scenarioPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                      onClick={(event) => {
                        event.preventDefault()
                        setScenarioPage(Math.max(1, scenarioPage - 1))
                      }}
                    >
                      <ChevronLeftIcon />
                      <span className="hidden text-xs sm:inline">{t("common.previous")}</span>
                    </PaginationLink>
                  </PaginationItem>
                  {scenarioPageItems.map((page, index) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="size-8" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          size="icon-sm"
                          isActive={page === scenarioPage}
                          className="text-xs"
                          onClick={(event) => {
                            event.preventDefault()
                            setScenarioPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      aria-label={t("common.next")}
                      aria-disabled={scenarioPage === scenarioPageCount}
                      tabIndex={scenarioPage === scenarioPageCount ? -1 : 0}
                      className={`size-8 gap-1 p-0 sm:w-auto sm:px-3 ${scenarioPage === scenarioPageCount ? "pointer-events-none opacity-50" : ""}`}
                      onClick={(event) => {
                        event.preventDefault()
                        setScenarioPage(Math.min(scenarioPageCount, scenarioPage + 1))
                      }}
                    >
                      <span className="hidden text-xs sm:inline">{t("common.next")}</span>
                      <ChevronRightIcon />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </PageLayoutContent>
      <BenchmarkScenarioForm
        key={formVersion}
        scenario={editingScenario}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={saveScenario}
      />
    </PageLayout>
  )
}
