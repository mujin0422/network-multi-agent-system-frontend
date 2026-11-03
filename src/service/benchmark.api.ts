import { api } from "./api"
import type { BenchmarkRun, BenchmarkRunSummary, BenchmarkScenario, BenchmarkScenarioCreate, BenchmarkScenarioDetail, BenchmarkScenarioUpdate } from "./contracts"

export const benchmarksApi = {
  listScenarios: async () =>
    (await api.get<BenchmarkScenario[]>("/benchmarks/scenarios")).data,
  createScenario: async (payload: BenchmarkScenarioCreate) =>
    (await api.post<BenchmarkScenario>("/benchmarks/scenarios", payload)).data,
  getScenario: async (scenarioId: string) =>
    (await api.get<BenchmarkScenarioDetail>(`/benchmarks/scenarios/${scenarioId}`)).data,
  updateScenario: async (scenarioId: string, payload: BenchmarkScenarioUpdate) =>
    (await api.patch<BenchmarkScenario>(`/benchmarks/scenarios/${scenarioId}`, payload)).data,
  getRunSummary: async () =>
    (await api.get<BenchmarkRunSummary>("/benchmarks/runs/summary")).data,
  listRuns: async (limit = 20) =>
    (await api.get<BenchmarkRun[]>("/benchmarks/runs", { params: { limit } })).data,
  start: async (scenarioId: string) =>
    (await api.post<BenchmarkRun>("/benchmarks/runs", { scenario_id: scenarioId })).data,
  getRun: async (runId: string) =>
    (await api.get<BenchmarkRun>(`/benchmarks/runs/${runId}`)).data,
  cleanup: async (runId: string) =>
    (await api.post<BenchmarkRun>(`/benchmarks/runs/${runId}/cleanup`)).data,
}
