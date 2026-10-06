import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_DEVICE_ACTION_LOGS } from "../data"
import type { DeviceActionStatus } from "../types"

export function useAuditLogsData() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<DeviceActionStatus | "ALL">("ALL")
  const rows = useMemo(
    () =>
      MOCK_DEVICE_ACTION_LOGS.filter(
        (log) =>
          [log.id, log.task_id, log.device_id, log.command, log.status]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === "ALL" || log.status === status),
      ),
    [query, status],
  )
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
