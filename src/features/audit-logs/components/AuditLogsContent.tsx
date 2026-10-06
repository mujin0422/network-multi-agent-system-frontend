import { Activity, Download, Terminal, TriangleAlert } from "lucide-react"
import { useState } from "react"
import type { FormMode } from "@/components/common/FeatureFormSheet"
import { DataPagination } from "@/components/common/DataPagination"
import {
  FeatureHeader,
  FilterCombobox,
  StatCard,
  StatusBadge,
  TableToolbar,
} from "@/components/common/FeatureShell"
import { MoreMenu } from "@/components/common/MoreMenu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuditLogsData } from "../hooks/useAuditLogsData"
import type { DeviceActionLog } from "../types"
import { AuditLogForm } from "./AuditLogForm"

/** Màn hình tra cứu, lọc và xem chi tiết lịch sử lệnh đã chạy trên thiết bị. */
export function AuditLogsContent() {
  const { query, rows, pagination, status, setQuery, setStatus } =
    useAuditLogsData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    log: DeviceActionLog | null
  }>({ open: false, mode: "view", log: null })
  return (
    <>
      <div className="space-y-5">
        <FeatureHeader
          title="Audit Logs"
          description="Immutable trail of commands that were actually sent to network devices."
          action={
            <Button variant="outline" size="sm">
              <Download />
              Export CSV
            </Button>
          }
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Commands today"
            value="5"
            detail="Across 4 tasks"
            icon={Terminal}
          />
          <StatCard
            label="Successful"
            value="4"
            detail="80% success rate"
            icon={Activity}
            tone="green"
          />
          <StatCard
            label="Failed"
            value="1"
            detail="Connection timeout"
            icon={TriangleAlert}
            tone="red"
          />
        </div>
        <Card className="gap-0 py-0">
          <TableToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Search command, device, task ID..."
          >
            <FilterCombobox
              value={status}
              onValueChange={setStatus}
              ariaLabel="Filter by result"
              options={[
                { value: "ALL", label: "All results" },
                { value: "SUCCESS", label: "Success" },
                { value: "FAILED", label: "Failed" },
              ]}
            />
          </TableToolbar>
          <Table>
            <TableHeader>
              <TableRow className="text-[10px] uppercase text-muted-foreground">
                <TableHead className="pl-4">Timestamp</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Command</TableHead>
                <TableHead>Task trace</TableHead>
                <TableHead>Result</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-4 text-[10px] text-muted-foreground">
                    {new Date(log.executed_at).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="font-mono text-[10px]">
                    {log.device_id}
                  </TableCell>
                  <TableCell className="max-w-[260px]">
                    <code className="block truncate rounded bg-background px-2 py-1.5 text-[10px] text-blue-300">
                      {log.command}
                    </code>
                    {log.error_message && (
                      <p className="mt-1 truncate text-[9px] text-red-400">
                        {log.error_message}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-mono text-[9px] text-muted-foreground">
                      {log.task_id}
                    </p>
                    <p className="mt-0.5 font-mono text-[8px] text-muted-foreground/60">
                      {log.execution_id}
                    </p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={log.status} />
                  </TableCell>
                  <TableCell>
                    <MoreMenu
                      onView={() => setForm({ open: true, mode: "view", log })}
                      onCopy={() => navigator.clipboard?.writeText(log.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataPagination {...pagination} onPageChange={pagination.setPage} />
        </Card>
      </div>
      <AuditLogForm
        open={form.open}
        mode={form.mode}
        log={form.log}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
      />
    </>
  )
}
