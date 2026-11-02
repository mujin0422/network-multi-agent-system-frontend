import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { PageLayout, PageLayoutContent, PageLayoutHeader } from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { BenchmarkCurrentRun } from "./components/BenchmarkCurrentRun"
import { BenchmarkRunHistory } from "./components/BenchmarkRunHistory"
import { BenchmarkScenarioCard } from "./components/BenchmarkScenarioCard"
import { BenchmarkScenarioForm } from "./components/BenchmarkScenarioForm"
import { BenchmarkStats } from "./components/BenchmarkStats"
import { useBenchmarksData } from "./hooks/use-benchmarks-data"
import { benchmarkChatPath } from "./utils/benchmark.util"

export default function BenchmarksPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
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
    startScenario,
    cleanupRun,
    toggleScenario,
  } = useBenchmarksData()

  function openCreateForm() {
    setFormVersion((current) => current + 1)
    setCreateOpen(true)
  }

  function openChat() {
    if (!selectedRun) return
    navigate(benchmarkChatPath(selectedRun.id, selectedRun.initial_message))
  }

  const runInProgress = selectedRun !== null && selectedRun.status !== "CLEANED"

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

        {error && <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{error}</p>}

        {selectedRun && (
          <BenchmarkCurrentRun
            run={selectedRun}
            busy={busy}
            onOpenChat={openChat}
            onCleanup={() => void cleanupRun(selectedRun.id)}
          />
        )}

        {loading ? (
          <p className="text-xs text-muted-foreground">{t("benchmarks.loading")}</p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {scenarios.map((scenario) => (
              <BenchmarkScenarioCard
                key={scenario.id}
                scenario={scenario}
                busy={busy}
                startDisabled={busy || runInProgress}
                onStart={(scenarioId) => void startScenario(scenarioId)}
                onToggle={(row) => void toggleScenario(row)}
              />
            ))}
          </div>
        )}

        <BenchmarkRunHistory runs={runs} onSelect={setSelectedRun} />
      </PageLayoutContent>

      <BenchmarkScenarioForm
        key={formVersion}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={createScenario}
      />
    </PageLayout>
  )
}
