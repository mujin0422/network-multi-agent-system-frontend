import { api } from "@/service/api"
import type { BenchmarkRun, BenchmarkScenario, BenchmarkScenarioCreate, BenchmarkScenarioDetail, BenchmarkScenarioUpdate } from "@/service/contracts"

export const benchmarkScenariosApi = {
  listScenarios: async () =>
    (await api.get<BenchmarkScenario[]>("/benchmarks/scenarios")).data,
  createScenario: async (payload: BenchmarkScenarioCreate) =>
    (await api.post<BenchmarkScenario>("/benchmarks/scenarios", payload)).data,
  getScenario: async (scenarioId: string) =>
    (await api.get<BenchmarkScenarioDetail>(`/benchmarks/scenarios/${scenarioId}`)).data,
  updateScenario: async (scenarioId: string, payload: BenchmarkScenarioUpdate) =>
    (await api.patch<BenchmarkScenario>(`/benchmarks/scenarios/${scenarioId}`, payload)).data,
  start: async (scenarioId: string) =>
    (await api.post<BenchmarkRun>("/benchmarks/runs", { scenario_id: scenarioId })).data,
}
