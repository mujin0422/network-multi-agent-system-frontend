import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { PageLayout, PageLayoutContent, PageLayoutHeader } from "@/components/shared/PageLayout"
import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { Button } from "@/components/ui/button"
import { benchmarksApi } from "@/service"
import type { BenchmarkScenarioCreate, BenchmarkScenarioDetail, BenchmarkScenarioUpdate } from "@/service"
import { BenchmarkScenarioCard } from "./components/BenchmarkScenarioCard"
import { BenchmarkScenarioForm } from "./components/BenchmarkScenarioForm"
import { useBenchmarksData } from "./hooks/use-benchmarks-data"
import { benchmarkErrorMessage } from "./utils/benchmark.util"

export default function BenchmarksPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingScenario, setEditingScenario] = useState<BenchmarkScenarioDetail | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [formVersion, setFormVersion] = useState(0)
  const { scenarios, runs, runsLoadFailed, loading, busy, error, reload, createScenario, updateScenario, startScenario, toggleScenario } = useBenchmarksData()

  function openCreateForm() {
    setEditingScenario(null)
    setEditError(null)
    setFormVersion((current) => current + 1)
    setCreateOpen(true)
  }

  async function openEditForm(scenarioId: string) {
    if (editingId) return
    setEditingId(scenarioId)
    setEditError(null)
    try {
      const detail = await benchmarksApi.getScenario(scenarioId)
      setEditingScenario(detail)
      setFormVersion((current) => current + 1)
      setCreateOpen(true)
    } catch (reason) {
      setEditError(benchmarkErrorMessage(reason, t("benchmarks.errors.load")))
    } finally {
      setEditingId(null)
    }
  }

  async function saveScenario(payload: BenchmarkScenarioCreate) {
    if (!editingScenario) {
      await createScenario(payload)
      return
    }
    const changes: BenchmarkScenarioUpdate = {
      version: payload.version,
      name: payload.name,
      description: payload.description,
      topology: payload.topology,
      initial_message: payload.initial_message,
      preconditions: payload.preconditions,
      injection: payload.injection,
      fault_verification: payload.fault_verification,
      ground_truth: payload.ground_truth,
      evaluation_required_terms: payload.evaluation_required_terms,
      cleanup: payload.cleanup,
    }
    await updateScenario(editingScenario.id, changes)
  }

  async function startAndOpenRun(scenarioId: string) {
    const run = await startScenario(scenarioId)
    if (run) navigate(`/benchmark-runs?run=${encodeURIComponent(run.id)}`)
  }

  const existingRunNeedsAttention = runs.some(
    (run) => ["PREPARING", "READY", "RUNNING"].includes(run.status) || run.cleanup_required,
  )

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
          {scenarios.map((scenario) => (
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
