import { api } from "./api"
import type { BenchmarkRun, BenchmarkRunPage, BenchmarkRunSummary, BenchmarkScenario, BenchmarkScenarioCreate, BenchmarkScenarioDetail, BenchmarkScenarioUpdate } from "./contracts"

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
  listRunPage: async (page = 1, pageSize = 100) =>
    (await api.get<BenchmarkRunPage>("/benchmarks/runs/page", {
      params: { page, page_size: pageSize },
    })).data,
  listAllRuns: async () => {
    const firstPage = (await api.get<BenchmarkRunPage>("/benchmarks/runs/page", {
      params: { page: 1, page_size: 100 },
    })).data
    const runs = [...firstPage.items]
    for (let page = 2; page <= firstPage.total_pages; page += 1) {
      const nextPage = (await api.get<BenchmarkRunPage>("/benchmarks/runs/page", {
        params: { page, page_size: 100 },
      })).data
      runs.push(...nextPage.items)
    }
    return runs
  },
  start: async (scenarioId: string) =>
    (await api.post<BenchmarkRun>("/benchmarks/runs", { scenario_id: scenarioId })).data,
  getRun: async (runId: string) =>
    (await api.get<BenchmarkRun>(`/benchmarks/runs/${runId}`)).data,
  cleanup: async (runId: string) =>
    (await api.post<BenchmarkRun>(`/benchmarks/runs/${runId}/cleanup`)).data,
}
