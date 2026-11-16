import { api } from "@/service/api"
import type { BenchmarkRun, BenchmarkRunPage, BenchmarkRunSummary } from "@/service/contracts"

export const benchmarkRunsApi = {
  getSummary: async () =>
    (await api.get<BenchmarkRunSummary>("/benchmarks/runs/summary")).data,
  list: async (limit = 20) =>
    (await api.get<BenchmarkRun[]>("/benchmarks/runs", { params: { limit } })).data,
  listPage: async (page = 1, pageSize = 100) =>
    (await api.get<BenchmarkRunPage>("/benchmarks/runs/page", {
      params: { page, page_size: pageSize },
    })).data,
  listAll: async () => {
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
  get: async (runId: string) =>
    (await api.get<BenchmarkRun>(`/benchmarks/runs/${runId}`)).data,
  cleanup: async (runId: string) =>
    (await api.post<BenchmarkRun>(`/benchmarks/runs/${runId}/cleanup`)).data,
}
