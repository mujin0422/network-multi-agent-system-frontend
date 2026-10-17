import type { DeviceActionLog } from "../types/device-action-log.type"
import type { DeviceActionStatus } from "../types/device-action-status.type"

export function matchesAuditLog(log: DeviceActionLog, query: string, status: DeviceActionStatus | "ALL") {
  const matchesQuery = [log.id, log.task_id, log.device_id, log.command, log.action_type, log.action_phase, log.action_log_status]
    .join(" ")
    .toLowerCase()
    .includes(query.trim().toLowerCase())
  return matchesQuery && (status === "ALL" || log.action_log_status === status)
}
