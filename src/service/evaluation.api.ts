import { api } from "./api"
import type { TaskEvaluationDetail } from "./contracts"

/** Existing evaluations only; a null result means the Task was not graded. */
export const evaluationsApi = {
  byTask: async (taskId: string) =>
    (await api.get<TaskEvaluationDetail | null>(`/evaluations/tasks/${taskId}`)).data,
}
