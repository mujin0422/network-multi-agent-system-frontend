import { api } from "@/service/api"
import type { AuditEventStatus, AuditLog } from "@/service/contracts"
import type { PageResponse } from "@/types/shared/page-response.type"

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

export type AuditLogPageParams = Omit<AuditLogListParams, "offset" | "limit"> & {
  page?: number
  page_size?: number
}

export const auditLogsApi = {
  list: async (params: AuditLogListParams = {}) =>
    (
      await api.get<AuditLog[]>("/audit-logs/", {
        params: { limit: 500, ...params },
      })
    ).data,
  page: async (params: AuditLogPageParams = {}) =>
    (await api.get<PageResponse<AuditLog>>("/audit-logs/page", { params })).data,
  getById: async (auditLogId: string) =>
    (await api.get<AuditLog>(`/audit-logs/${auditLogId}`)).data,
}
