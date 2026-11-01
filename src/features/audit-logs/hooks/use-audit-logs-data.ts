import { useCallback, useEffect, useMemo, useState } from "react"
import { auditLogsApi } from "@/service"
import type { AuditLog } from "../types/audit-log.type"

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

export function useAuditLogsData() {
  const [rows, setRows] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRows(await auditLogsApi.list())
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải nhật ký hệ thống")
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ audit logs với API khi mount.
  useEffect(() => { void reload() }, [reload])

  const summary = useMemo(() => ({
    total: rows.length,
    successful: rows.filter((log) => log.event_status === "SUCCESS").length,
    failed: rows.filter((log) => log.event_status === "FAILED").length,
    denied: rows.filter((log) => log.event_status === "DENIED").length,
  }), [rows])

  function exportCsv() {
    const headers = [
      "occurred_at", "actor_display_name", "actor_user_id", "actor_type",
      "action", "resource_type", "resource_id", "event_status", "summary",
      "request_id", "source_ip", "user_agent", "event_data",
    ]
    const lines = rows.map((log) => [
      log.occurred_at, log.actor_display_name, log.actor_user_id, log.actor_type,
      log.action, log.resource_type, log.resource_id, log.event_status, log.summary,
      log.request_id, log.source_ip, log.user_agent, JSON.stringify(log.event_data),
    ].map(csvCell).join(","))
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `system-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return { rows, summary, loading, error, reload, exportCsv }
}
