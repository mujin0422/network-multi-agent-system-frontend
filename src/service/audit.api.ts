import { api } from "./api"
import type { AuditEventStatus, AuditLog } from "./contracts"

export type AuditLogListParams = {
  actor_user_id?: string
  action?: string
  resource_type?: string
  event_status?: AuditEventStatus
  occurred_from?: string
  occurred_to?: string
  offset?: number
  limit?: number
}

export const auditLogsApi = {
  list: async (params: AuditLogListParams = {}) =>
    (
      await api.get<AuditLog[]>("/audit-logs/", {
        params: { limit: 500, ...params },
      })
    ).data,
  getById: async (auditLogId: string) =>
    (await api.get<AuditLog>(`/audit-logs/${auditLogId}`)).data,
}
