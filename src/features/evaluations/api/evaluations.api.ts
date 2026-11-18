import { api } from "@/service/api"
import type { TaskEvaluationDetail, TaskEvaluationSummary } from "@/service/contracts"
import type { PageRequest, PageResponse } from "@/types/shared/page-response.type"

/** Existing evaluations only; a null result means the Task was not graded. */
export const evaluationsApi = {
  list: async (limit = 100) =>
    (await api.get<TaskEvaluationSummary[]>("/evaluations", { params: { limit } })).data,
  page: async (params: PageRequest = {}) =>
    (await api.get<PageResponse<TaskEvaluationSummary>>("/evaluations/page", { params })).data,
  listAll: async () => {
    const firstPage = await evaluationsApi.page({ page: 1, page_size: 100 })
    const evaluations = [...firstPage.items]

    for (let page = 2; page <= firstPage.total_pages; page += 1) {
      const nextPage = await evaluationsApi.page({ page, page_size: 100 })
      evaluations.push(...nextPage.items)
    }

    return evaluations
  },
  byTask: async (taskId: string) =>
    (await api.get<TaskEvaluationDetail | null>(`/evaluations/tasks/${taskId}`)).data,
}
