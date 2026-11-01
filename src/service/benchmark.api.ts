import { api } from "./api"
import type { BenchmarkRun, BenchmarkScenario, BenchmarkScenarioCreate } from "./contracts"

export const benchmarksApi = {
  listScenarios: async () =>
    (await api.get<BenchmarkScenario[]>("/benchmarks/scenarios")).data,
  createScenario: async (payload: BenchmarkScenarioCreate) =>
    (await api.post<BenchmarkScenario>("/benchmarks/scenarios", payload)).data,
  updateScenario: async (scenarioId: string, payload: { is_active: boolean }) =>
    (await api.patch<BenchmarkScenario>(`/benchmarks/scenarios/${scenarioId}`, payload)).data,
  listRuns: async (limit = 20) =>
    (await api.get<BenchmarkRun[]>("/benchmarks/runs", { params: { limit } })).data,
  start: async (scenarioId: string) =>
    (await api.post<BenchmarkRun>("/benchmarks/runs", { scenario_id: scenarioId })).data,
  getRun: async (runId: string) =>
    (await api.get<BenchmarkRun>(`/benchmarks/runs/${runId}`)).data,
  cleanup: async (runId: string) =>
    (await api.post<BenchmarkRun>(`/benchmarks/runs/${runId}/cleanup`)).data,
}
