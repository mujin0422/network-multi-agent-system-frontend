import { useState } from "react"
import { useTranslation } from "react-i18next"

import { benchmarkScenariosApi } from "../api/benchmark-scenarios.api"
import type { BenchmarkScenarioCreate, BenchmarkScenarioDetail, BenchmarkScenarioUpdate } from "@/service"
import { BENCHMARK_SCENARIOS_PER_PAGE } from "../constants/benchmark-scenarios.constants"
import { benchmarkErrorMessage, createBenchmarkScenarioPageItems } from "../utils/benchmark.util"
import { useBenchmarkScenariosData } from "./use-benchmark-scenarios-data"

/** Quản lý trạng thái form, chỉnh sửa và phân trang của trang benchmark scenario. */
export function useBenchmarkScenariosPage() {
  const { t } = useTranslation()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingScenario, setEditingScenario] = useState<BenchmarkScenarioDetail | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [formVersion, setFormVersion] = useState(0)
  const [requestedScenarioPage, setRequestedScenarioPage] = useState(1)
  const data = useBenchmarkScenariosData()

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
      const detail = await benchmarkScenariosApi.getScenario(scenarioId)
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
      await data.createScenario(payload)
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
    await data.updateScenario(editingScenario.id, changes)
  }

  const existingRunNeedsAttention = data.runs.some(
    (run) => ["PREPARING", "READY", "RUNNING"].includes(run.status) || run.cleanup_required,
  )
  const scenarioPageCount = Math.max(
    1,
    Math.ceil(data.scenarios.length / BENCHMARK_SCENARIOS_PER_PAGE),
  )
  const scenarioPage = Math.min(requestedScenarioPage, scenarioPageCount)
  const scenarioStartIndex = (scenarioPage - 1) * BENCHMARK_SCENARIOS_PER_PAGE

  return {
    ...data,
    createOpen,
    setCreateOpen,
    editingScenario,
    editingId,
    editError,
    formVersion,
    openCreateForm,
    openEditForm,
    saveScenario,
    existingRunNeedsAttention,
    scenarioPage,
    scenarioPageCount,
    scenarioPageItems: createBenchmarkScenarioPageItems(scenarioPage, scenarioPageCount),
    setScenarioPage: setRequestedScenarioPage,
    visibleScenarios: data.scenarios.slice(
      scenarioStartIndex,
      scenarioStartIndex + BENCHMARK_SCENARIOS_PER_PAGE,
    ),
    scenarioStartItem: data.scenarios.length === 0 ? 0 : scenarioStartIndex + 1,
    scenarioEndItem: Math.min(
      scenarioStartIndex + BENCHMARK_SCENARIOS_PER_PAGE,
      data.scenarios.length,
    ),
  }
}
