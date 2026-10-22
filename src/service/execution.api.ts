import { api } from "./api"
import type {
  ApprovalDecision,
  Operation,
  OperationCreate,
  OperationDeviceApproval,
  Task,
  TaskActivityEvent,
  TaskCreate,
  TaskDetail,
} from "./contracts"

export const tasksApi = {
  list: async () => (await api.get<Task[]>("/tasks/")).data,
  get: async (taskId: string) => (await api.get<TaskDetail>(`/tasks/${taskId}`)).data,
  create: async (payload: TaskCreate) => (await api.post<Task>("/tasks/", payload)).data,
  listActivityEvents: async (taskId: string) =>
    (await api.get<TaskActivityEvent[]>(`/tasks/${taskId}/activity-events`)).data,
  addOperation: async (taskId: string, payload: OperationCreate) =>
    (await api.post<Operation>(`/tasks/${taskId}/operations`, payload)).data,
}

export const approvalsApi = {
  listByOperation: async (operationId: string) =>
    (await api.get<OperationDeviceApproval[]>(`/operations/${operationId}/approvals`)).data,
  decide: async (approvalId: string, decision: ApprovalDecision) =>
    (
      await api.post<OperationDeviceApproval>(
        `/operation-device-approvals/${approvalId}/decision`,
        { decision },
      )
    ).data,
}
