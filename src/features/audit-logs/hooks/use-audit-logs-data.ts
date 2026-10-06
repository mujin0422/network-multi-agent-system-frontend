import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_DEVICE_ACTION_LOGS } from "../data"
import type { DeviceActionLog, DeviceActionStatus } from "../types"

// Quản lý bộ lọc, kết quả và phân trang của nhật ký thao tác thiết bị.
export function useAuditLogsData() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<DeviceActionStatus | "ALL">("ALL")

  // Lọc danh sách nhật ký theo từ khóa và trạng thái hiện tại.
  const rows = useMemo(function filterRows() {
    // Kiểm tra nhật ký có khớp từ khóa và trạng thái đang chọn hay không.
    function matchesFilters(log: DeviceActionLog) {
      const matchesQuery = [
        log.id,
        log.task_id,
        log.device_id,
        log.command,
        log.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())

      return matchesQuery && (status === "ALL" || log.status === status)
    }

    return MOCK_DEVICE_ACTION_LOGS.filter(matchesFilters)
  }, [query, status])
  const pagination = useDataPagination(rows)
  return {
    query,
    rows: pagination.pageRows,
    pagination,
    status,
    setQuery,
    setStatus,
  }
}
