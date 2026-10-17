import { useMemo } from "react"
import { MOCK_DEVICE_ACTION_LOGS } from "../mocks/audit-logs.mock"

// Quản lý bộ lọc, kết quả và phân trang của nhật ký thao tác thiết bị.
export function useAuditLogsData() {
  const rows = MOCK_DEVICE_ACTION_LOGS
  const summary = useMemo(() => ({
    total: MOCK_DEVICE_ACTION_LOGS.length,
    successful: MOCK_DEVICE_ACTION_LOGS.filter((log) => log.action_log_status === "SUCCESS").length,
    failed: MOCK_DEVICE_ACTION_LOGS.filter((log) => log.action_log_status === "FAILED").length,
    unknown: MOCK_DEVICE_ACTION_LOGS.filter((log) => log.action_log_status === "UNKNOWN").length,
  }), [])
  return {
    rows,
    summary,
  }
}
