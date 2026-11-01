import { api } from "./api"
import type { DeviceActionLog } from "./contracts"

export const auditLogsApi = {
  list: async (limit = 500) =>
    (await api.get<DeviceActionLog[]>("/audit-logs/", { params: { limit } })).data,
}
