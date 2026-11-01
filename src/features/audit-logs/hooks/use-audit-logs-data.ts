import { useCallback, useEffect, useMemo, useState } from "react"
import { auditLogsApi } from "@/service"
import type { DeviceActionLog } from "../types/device-action-log.type"

function csvCell(value: string | number | null) {
  const text = value == null ? "" : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

export function useAuditLogsData() {
  const [rows, setRows] = useState<DeviceActionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRows(await auditLogsApi.list())
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải nhật ký thiết bị")
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ audit logs với API khi mount.
  useEffect(() => { void reload() }, [reload])

  const summary = useMemo(() => ({
    total: rows.length,
    successful: rows.filter((log) => log.action_log_status === "SUCCESS").length,
    failed: rows.filter((log) => log.action_log_status === "FAILED").length,
    unknown: rows.filter((log) => log.action_log_status === "UNKNOWN").length,
  }), [rows])

  function exportCsv() {
    const headers = ["executed_at", "device_id", "task_id", "execution_id", "action_type", "action_phase", "command", "status", "error_message"]
    const lines = rows.map((log) => [
      log.executed_at, log.device_id, log.task_id, log.execution_id,
      log.action_type, log.action_phase, log.command,
      log.action_log_status, log.error_message,
    ].map(csvCell).join(","))
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `device-action-logs-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return { rows, summary, loading, error, reload, exportCsv }
}
