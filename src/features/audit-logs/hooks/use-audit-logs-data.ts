import { useCallback, useEffect, useMemo, useState } from "react"
import { auditLogsApi } from "@/service"
import type { AuditLog } from "../types/audit-log.type"

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

function isAuditLog(value: unknown): value is AuditLog {
  if (!value || typeof value !== "object") return false

  const log = value as Partial<AuditLog>
  return (
    typeof log.id === "string" &&
    typeof log.action === "string" &&
    typeof log.resource_type === "string" &&
    typeof log.occurred_at === "string" &&
    (log.actor_type === "USER" ||
      log.actor_type === "SYSTEM" ||
      log.actor_type === "AGENT") &&
    (log.event_status === "SUCCESS" ||
      log.event_status === "FAILED" ||
      log.event_status === "DENIED")
  )
}

export function useAuditLogsData() {
  const [rows, setRows] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const payload: unknown = await auditLogsApi.list()
      if (!Array.isArray(payload) || !payload.every(isAuditLog)) {
        throw new Error(
          "Dữ liệu Audit Logs không đúng định dạng. Hãy rebuild hoặc khởi động lại Backend để sử dụng System Audit API mới.",
        )
      }
      setRows(payload)
    } catch (reason) {
      setRows([])
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
