import { api } from "./api"
import type { TaskEvaluationDetail, TaskEvaluationSummary } from "./contracts"

/** Existing evaluations only; a null result means the Task was not graded. */
export const evaluationsApi = {
  list: async (limit = 100) =>
    (await api.get<TaskEvaluationSummary[]>("/evaluations", { params: { limit } })).data,
  byTask: async (taskId: string) =>
    (await api.get<TaskEvaluationDetail | null>(`/evaluations/tasks/${taskId}`)).data,
}
