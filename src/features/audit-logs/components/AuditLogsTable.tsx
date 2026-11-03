import { TableIdentifier } from "@/components/shared/TableIdentifier"
import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { Download, LoaderCircle } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useState } from "react"
import type { FormMode } from "@/types/components"
import {
  DataTable,
  DataTableContent,
  DataTableDateRangeFilter,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
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
  AUDIT_ACTOR_TYPE_LABELS,
  AUDIT_ACTOR_TYPE_OPTIONS,
  AUDIT_STATUS_LABELS,
  AUDIT_STATUS_OPTIONS,
} from "../constants/audit-logs.constants"
import { useAuditLogsData } from "../hooks/use-audit-logs-data"
import type { AuditLog } from "../types/audit-log.type"
import { AuditLogForm } from "./AuditLogForm"
import { AuditLogStats } from "./AuditLogStats"

/** Màn hình tra cứu, lọc và xem chi tiết lịch sử hoạt động của toàn hệ thống. */
export function AuditLogsTable() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const { rows, summary, loading, initialLoading, error, exportCsv } = useAuditLogsData(dateRange)
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    log: AuditLog | null
  }>({ open: false, mode: "view", log: null })
  const headerAction = (
    <Button variant="outline" size="sm" disabled={!rows.length} onClick={exportCsv}>
      <Download />
      Export CSV
    </Button>
  )
  if (initialLoading) {
    return (
      <PageLoadingSkeleton
        title="Audit Logs"
        description="Immutable trail of security, administrative, system, and agent events."
        stats={4}
      />
    )
  }

  return (
    <>
      <PageLayout>
        <PageLayoutHeader
          title="Audit Logs"
          description="Immutable trail of security, administrative, system, and agent events."
        >
          {headerAction}
        </PageLayoutHeader>
        <AuditLogStats summary={summary} />
        <PageLayoutContent>
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}
          <DataTable
            data={rows}
            getRowId={(log) => log.id}
            filters={[
              {
                id: "status",
                label: "status",
                accessorKey: "event_status",
                allLabel: "All statuses",
                options: AUDIT_STATUS_OPTIONS,
              },
              {
                id: "actorType",
                label: "actor type",
                accessorKey: "actor_type",
                allLabel: "All actor types",
                options: AUDIT_ACTOR_TYPE_OPTIONS,
              },
            ]}
            columns={[
              {
                id: "timestamp",
                header: "Timestamp",
                headerClassName: "pl-4",
                className: "pl-4 type-caption text-muted-foreground",
                cell: (log) =>
                  new Date(log.occurred_at).toLocaleString("vi-VN"),
              },
              {
                id: "actor",
                header: "Actor",
                cell: (log) => (
                  <>
                    <p className="type-body-sm font-medium">
                      {log.actor_display_name ?? "System"}
                    </p>
                    <p className="mt-1 type-caption text-muted-foreground">
                      {AUDIT_ACTOR_TYPE_LABELS[log.actor_type]}
                      {log.actor_user_id ? ` · ${log.actor_user_id}` : ""}
                    </p>
                  </>
                ),
              },
              {
                id: "action",
                header: "Action",
                className: "max-w-[280px]",
                cell: (log) => (
                  <>
                    <code className="block truncate type-caption text-blue-300">
                      {log.action}
                    </code>
                    <p className="mt-1 truncate type-caption text-muted-foreground">
                      {log.summary ?? "No summary provided"}
                    </p>
                  </>
                ),
              },
              {
                id: "resource",
                header: "Resource",
                cell: (log) => (
                  <>
                    <p className="type-body-sm">{log.resource_type}</p>
                    <TableIdentifier value={log.resource_id} variant="reference" className="mt-1 max-w-[220px] truncate" />
                  </>
                ),
              },
              {
                id: "status",
                header: "Status",
                cell: (log) => (
                  <StatusBadge
                    value={log.event_status}
                    label={AUDIT_STATUS_LABELS[log.event_status]}
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
              <DataTableToolbar className="lg:justify-end">
                <DataTableToolbarActions>
                  <DataTableDateRangeFilter
                    value={dateRange}
                    onChange={setDateRange}
                  />
                  <DataTableFilters />
                  {loading && (
                    <LoaderCircle
                      aria-label="Loading audit events"
                      className="size-4 animate-spin text-muted-foreground"
                    />
                  )}
                </DataTableToolbarActions>
              </DataTableToolbar>
              <DataTableContent />
              <DataTablePagination itemLabel="events" />
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
