import { api } from "@/service/api"
import type { TaskEvaluationDetail, TaskEvaluationSummary } from "@/service/contracts"
import type { PageRequest, PageResponse } from "@/types/shared/page-response.type"

/** Existing evaluations only; a null result means the Task was not graded. */
export const evaluationsApi = {
  list: async (limit = 100) =>
    (await api.get<TaskEvaluationSummary[]>("/evaluations", { params: { limit } })).data,
  page: async (params: PageRequest = {}) =>
    (await api.get<PageResponse<TaskEvaluationSummary>>("/evaluations/page", { params })).data,
  byTask: async (taskId: string) =>
    (await api.get<TaskEvaluationDetail | null>(`/evaluations/tasks/${taskId}`)).data,
}
