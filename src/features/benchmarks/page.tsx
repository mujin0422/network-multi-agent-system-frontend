import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { PageLayout, PageLayoutContent, PageLayoutHeader } from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { benchmarksApi } from "@/service"
import type { BenchmarkScenarioCreate, BenchmarkScenarioDetail, BenchmarkScenarioUpdate } from "@/service"
import { BenchmarkCurrentRun } from "./components/BenchmarkCurrentRun"
import { BenchmarkEvaluationSheet } from "./components/BenchmarkEvaluationSheet"
import { BenchmarkRunHistory } from "./components/BenchmarkRunHistory"
import { BenchmarkScenarioCard } from "./components/BenchmarkScenarioCard"
import { BenchmarkScenarioForm } from "./components/BenchmarkScenarioForm"
import { BenchmarkStats } from "./components/BenchmarkStats"
import { useBenchmarksData } from "./hooks/use-benchmarks-data"
import { benchmarkChatPath, benchmarkErrorMessage } from "./utils/benchmark.util"

export default function BenchmarksPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [evaluationOpen, setEvaluationOpen] = useState(false)
  const [editingScenario, setEditingScenario] = useState<BenchmarkScenarioDetail | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [formVersion, setFormVersion] = useState(0)
  const {
    scenarios,
    runs,
    selectedRun,
    loading,
    busy,
    error,
    summary,
    setSelectedRun,
    createScenario,
    updateScenario,
    startScenario,
    cleanupRun,
    toggleScenario,
  } = useBenchmarksData()

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
    // scenario_key là định danh bất biến.
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

  function openChat() {
    if (!selectedRun) return
    navigate(benchmarkChatPath(selectedRun.id, selectedRun.initial_message))
  }

  const runInProgress = selectedRun !== null && selectedRun.status !== "CLEANED"

  if (loading) {
    return (
      <PageLoadingSkeleton
        title={t("benchmarks.title")}
        description={t("benchmarks.description")}
        stats={4}
        variant="cards"
      />
    )
  }

  return (
    <PageLayout>
      <PageLayoutHeader title={t("benchmarks.title")} description={t("benchmarks.description")}>
        <Button size="sm" onClick={openCreateForm}>{t("benchmarks.addScenario")}</Button>
      </PageLayoutHeader>
      <BenchmarkStats summary={summary} />
      <PageLayoutContent className="space-y-6">
        <div className="grid grid-cols-[56px_minmax(0,1fr)] rounded-xl border border-amber-500/25 bg-amber-500/5 text-xs">
          <div className="grid place-items-center">
            <AlertTriangle className="size-5 text-amber-400" />
          </div>
          <div className="p-4">
            <p className="font-medium">{t("benchmarks.warningTitle")}</p>
            <p className="mt-1 text-muted-foreground">{t("benchmarks.warningDescription")}</p>
          </div>
        </div>

        {(error || editError) && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{editError || error}</p>}

        {selectedRun && (
          <BenchmarkCurrentRun
            run={selectedRun}
            busy={busy}
            onOpenChat={openChat}
            onCleanup={() => void cleanupRun(selectedRun.id)}
            onViewEvaluation={() => setEvaluationOpen(true)}
          />
        )}

        <div className="grid gap-4 xl:grid-cols-2">
            {scenarios.map((scenario) => (
              <BenchmarkScenarioCard
                key={scenario.id}
                scenario={scenario}
                busy={busy}
                startDisabled={busy || runInProgress}
                editLoading={editingId === scenario.id}
                onEdit={(scenarioId) => void openEditForm(scenarioId)}
                onStart={(scenarioId) => void startScenario(scenarioId)}
                onToggle={(row) => void toggleScenario(row)}
              />
            ))}
        </div>

        <BenchmarkRunHistory runs={runs} onSelect={setSelectedRun} />
      </PageLayoutContent>

      <BenchmarkEvaluationSheet
        open={evaluationOpen}
        taskId={selectedRun?.task_id ?? null}
        onOpenChange={setEvaluationOpen}
      />
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
