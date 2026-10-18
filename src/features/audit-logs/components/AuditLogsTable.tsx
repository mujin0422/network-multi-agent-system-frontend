import { Download } from "lucide-react"
import { useState } from "react"
import type { FormMode } from "@/types/components"
import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
} from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MoreMenu } from "@/components/shared/MoreMenu"
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import {
  AUDIT_ACTION_PHASE_LABELS,
  AUDIT_ACTION_TYPE_LABELS,
  AUDIT_STATUS_LABELS,
  AUDIT_STATUS_OPTIONS,
} from "../constants/audit-logs.constants"
import { useAuditLogsData } from "../hooks/use-audit-logs-data"
import type { DeviceActionLog } from "../types/device-action-log.type"
import { AuditLogForm } from "./AuditLogForm"
import { AuditLogStats } from "./AuditLogStats"

/** Màn hình tra cứu, lọc và xem chi tiết lịch sử lệnh đã chạy trên thiết bị. */
export function AuditLogsTable() {
  const { rows, summary } = useAuditLogsData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    log: DeviceActionLog | null
  }>({ open: false, mode: "view", log: null })
  const headerAction = (
    <Button variant="outline" size="sm">
      <Download />
      Export CSV
    </Button>
  )
  return (
    <>
      <PageLayout>
        <PageLayoutHeader
          title="Audit Logs"
          description="Immutable trail of commands that were actually sent to network devices."
        >
          {headerAction}
        </PageLayoutHeader>
        <AuditLogStats summary={summary} />
        <PageLayoutContent>
          <DataTable
            data={rows}
            getRowId={(log) => log.id}
            filters={[
              {
                id: "result",
                label: "result",
                accessorKey: "action_log_status",
                allLabel: "All results",
                options: AUDIT_STATUS_OPTIONS,
              },
            ]}
            searchValue={(log) =>
              `${log.command} ${log.device_id} ${log.task_id} ${log.execution_id}`
            }
            columns={[
              {
                id: "timestamp",
                header: "Timestamp",
                headerClassName: "pl-4",
                className: "pl-4 type-caption text-muted-foreground",
                cell: (log) =>
                  new Date(log.executed_at).toLocaleString("vi-VN"),
              },
              {
                id: "device",
                header: "Device",
                accessorKey: "device_id",
                className: "font-mono type-caption",
              },
              {
                id: "command",
                header: "Command",
                className: "max-w-[260px]",
                cell: (log) => (
                  <>
                    <code className="block truncate rounded bg-background px-2 py-2 type-caption text-blue-300">
                      {log.command}
                    </code>
                    <p className="mt-1 type-caption text-muted-foreground">
                      {AUDIT_ACTION_TYPE_LABELS[log.action_type]} ·{" "}
                      {AUDIT_ACTION_PHASE_LABELS[log.action_phase]}
                    </p>
                    {log.error_message && (
                      <p className="mt-1 truncate type-caption text-red-400">
                        {log.error_message}
                      </p>
                    )}
                  </>
                ),
              },
              {
                id: "trace",
                header: "Task trace",
                cell: (log) => (
                  <>
                    <p className="font-mono type-caption text-muted-foreground">
                      {log.task_id}
                    </p>
                    <p className="mt-1 font-mono type-micro text-muted-foreground/60">
                      {log.execution_id}
                    </p>
                  </>
                ),
              },
              {
                id: "result",
                header: "Result",
                cell: (log) => (
                  <StatusBadge
                    value={log.action_log_status}
                    label={AUDIT_STATUS_LABELS[log.action_log_status]}
                  />
                ),
              },
              {
                id: "actions",
                header: null,
                cell: (log) => (
                  <MoreMenu
                    onView={() => setForm({ open: true, mode: "view", log })}
                    onCopy={() => navigator.clipboard?.writeText(log.id)}
                  />
                ),
              },
            ]}
          >
            <DataTablePanel>
              <DataTableToolbar>
                <DataTableSearch placeholder="Search command, device, task ID..." />
                <DataTableToolbarActions>
                  <DataTableFilters />
                </DataTableToolbarActions>
              </DataTableToolbar>
              <DataTableContent />
              <DataTablePagination itemLabel="logs" />
            </DataTablePanel>
          </DataTable>
        </PageLayoutContent>
      </PageLayout>
      <AuditLogForm
        open={form.open}
        mode={form.mode}
        log={form.log}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
      />
    </>
  )
}
