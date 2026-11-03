import { useEffect, useMemo, useState, type ReactNode } from "react"

import { StatusBadge } from "@/components/shared/StatusBadge"
import { TaskEvaluationDetails } from "@/components/shared/TaskEvaluationDetails"
import { Button } from "@/components/ui/button"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError, deviceActionLogsApi, devicesApi, evaluationsApi, tasksApi } from "@/service"
import type { DeviceActionLog, TaskEvaluationDetail, TaskRecords } from "@/service"

type RecordTab = "plan" | "executions" | "devices" | "events" | "approvals" | "commands" | "evaluation"

type TaskRecordsSheetProps = {
  open: boolean
  taskId: string | null
  onOpenChange: (open: boolean) => void
}

function timestamp(value?: string | null): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("vi-VN")
}

function JsonDetail({ value }: { value: unknown }) {
  if (value == null) return <p className="text-xs text-muted-foreground">—</p>
  const formatted = typeof value === "string" ? value : JSON.stringify(value, null, 2)
  return (
    <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-lg border bg-muted/25 p-3 font-mono text-xs leading-relaxed">
      {formatted || "—"}
    </pre>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="min-w-0 break-all text-foreground">{children}</div>
    </div>
  )
}

function RecordCard({
  title, subtitle, status, children,
}: {
  title: string
  subtitle?: string
  status?: string
  children: ReactNode
}) {
  return (
    <article className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <h3 className="break-words text-sm font-semibold">{title}</h3>
          {subtitle && <p className="break-all font-mono text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
        {status && <StatusBadge value={status} />}
      </div>
      {children}
    </article>
  )
}

function EmptyRecords({ label }: { label: string }) {
  return (
    <p className="rounded-lg border border-dashed p-7 text-center text-xs text-muted-foreground">
      Chưa có bản ghi {label} cho task này.
    </p>
  )
}

function Section({ children }: { children: ReactNode }) {
  return <div className="space-y-3">{children}</div>
}

/** GROUP 3 AI Execution Management, filtered by task ID and read-only. */
export function TaskRecordsSheet({ open, taskId, onOpenChange }: TaskRecordsSheetProps) {
  const [data, setData] = useState<TaskRecords | null>(null)
  const [logs, setLogs] = useState<DeviceActionLog[]>([])
  const [evaluation, setEvaluation] = useState<TaskEvaluationDetail | null>(null)
  const [evaluationError, setEvaluationError] = useState<string | null>(null)
  const [hostnames, setHostnames] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logsError, setLogsError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<RecordTab>("plan")
  const [reloadVersion, setReloadVersion] = useState(0)

  useEffect(() => {
    if (!open || !taskId) return
    let cancelled = false
    const fetchRecords = async () => {
      setLoading(true)
      setData(null)
      setLogs([])
      setEvaluation(null)
      setEvaluationError(null)
      setError(null)
      setLogsError(null)
      setHostnames(new Map())
      try {
        // Command logs require Audit Log/View; failure must not hide other records.
        const [result, logResult, deviceResult, evaluationResult] = await Promise.allSettled([
          tasksApi.getRecords(taskId),
          deviceActionLogsApi.byTask(taskId),
          devicesApi.list({ page: 1, page_size: 100 }),
          evaluationsApi.byTask(taskId),
        ])
        if (cancelled) return
        if (result.status === "rejected") {
          setError(result.reason instanceof Error ? result.reason.message : "Không thể tải lịch sử thực thi")
        } else {
          setData(result.value)
        }
        if (logResult.status === "fulfilled") {
          setLogs(logResult.value)
        } else if (logResult.reason instanceof ApiError && logResult.reason.status === 403) {
          setLogsError("Tài khoản này chưa có quyền Audit Log → View để xem lệnh đã chạy.")
        } else {
          setLogsError(logResult.reason instanceof Error ? logResult.reason.message : "Không thể tải command logs.")
        }
        if (deviceResult.status === "fulfilled") {
          setHostnames(new Map(deviceResult.value.items.map((device) => [device.id, device.hostname])))
        }
        if (evaluationResult.status === "fulfilled") {
          setEvaluation(evaluationResult.value)
        } else {
          setEvaluationError(evaluationResult.reason instanceof Error
            ? evaluationResult.reason.message : "Không thể tải evaluation.")
        }
      } catch (reason) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Không thể tải dữ liệu")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void fetchRecords()
    return () => { cancelled = true }
  }, [open, taskId, reloadVersion])

  const operations = data?.task.operations ?? []
  const operationNames = useMemo(
    () => new Map((data?.task.operations ?? []).map((operation) => [operation.id, operation])),
    [data],
  )
  const operationLabel = (id: string | null) => {
    if (!id) return "—"
    const operation = operationNames.get(id)
    return operation ? `#${operation.display_order} ${operation.operation_intent.replaceAll("_", " ")}` : id
  }
  const deviceLabel = (id: string) => hostnames.get(id) ?? id
  const tabs: Array<{ id: RecordTab; label: string; count: number }> = [
    { id: "plan", label: "Execution plan", count: operations.length },
    { id: "executions", label: "AI / Tool", count: data?.executions.length ?? 0 },
    { id: "devices", label: "Devices", count: data?.operation_devices.length ?? 0 },
    { id: "events", label: "Activity", count: data?.activity_events.length ?? 0 },
    { id: "approvals", label: "Approvals", count: data?.approvals.length ?? 0 },
    { id: "commands", label: "Command logs", count: logs.length },
    { id: "evaluation", label: "Evaluation", count: evaluation?.metrics.length ?? 0 },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-4xl!">
        <SheetHeader className="shrink-0 border-b pr-12">
          <SheetTitle>Execution records</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-3">
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Execution record categories">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  size="xs"
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label} <span className="opacity-60">{tab.count}</span>
                </Button>
              ))}
            </div>
            <Button size="xs" variant="outline" disabled={loading} onClick={() => setReloadVersion((current) => current + 1)}>
              Refresh
            </Button>
          </div>
          <div role="tabpanel" className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            {loading && (
              <div role="status" className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
                <span className="sr-only">Loading execution records</span>
              </div>
            )}
            {!loading && error && (
              <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive">{error}</div>
            )}
            {!loading && data && (
              <>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border bg-muted/10 px-4 py-3 text-xs">
                  <span className="min-w-0">
                    <span className="font-medium">Task ID: </span>
                    <span className="break-all font-mono text-muted-foreground">{data.task.id}</span>
                  </span>
                  <span>
                    <span className="font-medium">Type: </span>
                    <span className="text-muted-foreground">
                      {data.task.task_type
                        .toLowerCase()
                        .replaceAll("_", " ")
                        .replace(/^./, (letter) => letter.toUpperCase())}
                    </span>
                  </span>
                </div>

                {activeTab === "plan" && (
                  <Section>
                    <RecordCard title="User request" subtitle={data.task.id}>
                      <p className="whitespace-pre-wrap break-words text-xs">{data.task.input_message}</p>
                      <DetailRow label="Conversation">{data.task.conversation_id}</DetailRow>
                      <DetailRow label="Started">{timestamp(data.task.started_at)}</DetailRow>
                      <DetailRow label="Completed">{timestamp(data.task.completed_at)}</DetailRow>
                    </RecordCard>
                    {operations.map((operation) => (
                      <RecordCard key={operation.id} title={operationLabel(operation.id)} subtitle={operation.id} status={operation.operation_status}>
                        <DetailRow label="Created">{timestamp(operation.created_at)}</DetailRow>
                        <DetailRow label="Started">{timestamp(operation.started_at)}</DetailRow>
                        <DetailRow label="Completed">{timestamp(operation.completed_at)}</DetailRow>
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground">Operation parameters</summary>
                          <div className="mt-2"><JsonDetail value={operation.operation_parameters} /></div>
                        </details>
                        {data.dependencies.filter((dep) => dep.operation_id === operation.id).map((dep) => (
                          <DetailRow key={dep.id} label="Depends on">
                            {operationLabel(dep.depends_on_operation_id)} · {dep.dependency_type}
                          </DetailRow>
                        ))}
                      </RecordCard>
                    ))}
                    {operations.length === 0 && <EmptyRecords label="operations" />}
                  </Section>
                )}

                {activeTab === "executions" && (
                  <Section>
                    {data.executions.map((execution) => (
                      <RecordCard
                        key={execution.id}
                        title={`#${execution.step_order} ${execution.agent_name}`}
                        subtitle={execution.id}
                        status={execution.execution_status}
                      >
                        <DetailRow label="Tool">{execution.tool_name ?? "—"}</DetailRow>
                        <DetailRow label="Operation">{operationLabel(execution.operation_id)}</DetailRow>
                        <DetailRow label="Device mapping">{execution.operation_device_id ?? "—"}</DetailRow>
                        <DetailRow label="Duration">{execution.duration_ms == null ? "—" : `${execution.duration_ms} ms`}</DetailRow>
                        <DetailRow label="Started">{timestamp(execution.started_at)}</DetailRow>
                        {execution.error_message && <p className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">{execution.error_message}</p>}
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground">Input / Output</summary>
                          <div className="mt-3 space-y-3">
                            <p className="font-medium">Input</p><JsonDetail value={execution.input} />
                            <p className="font-medium">Output</p><JsonDetail value={execution.output} />
                          </div>
                        </details>
                      </RecordCard>
                    ))}
                    {data.executions.length === 0 && <EmptyRecords label="Agent/Tool executions" />}
                  </Section>
                )}

                {activeTab === "devices" && (
                  <Section>
                    {data.operation_devices.map((mapping) => (
                      <RecordCard key={mapping.id} title={deviceLabel(mapping.device_id)} subtitle={mapping.id} status={mapping.operation_device_status}>
                        <DetailRow label="Device ID">{mapping.device_id}</DetailRow>
                        <DetailRow label="Operation">{operationLabel(mapping.operation_id)}</DetailRow>
                        <DetailRow label="Role">{mapping.device_role}</DetailRow>
                        <DetailRow label="Access">{mapping.access_mode}</DetailRow>
                        <DetailRow label="Started">{timestamp(mapping.started_at)}</DetailRow>
                        <DetailRow label="Completed">{timestamp(mapping.completed_at)}</DetailRow>
                        {mapping.error_message && <p className="text-xs text-destructive">{mapping.error_message}</p>}
                      </RecordCard>
                    ))}
                    {data.operation_devices.length === 0 && <EmptyRecords label="operation-device mappings" />}
                  </Section>
                )}

                {activeTab === "events" && (
                  <Section>
                    {data.activity_events.map((event) => (
                      <RecordCard key={event.id} title={`#${event.sequence_number} ${event.actor_type} · ${event.event_type.replaceAll("_", " ")}`} subtitle={event.id} status={event.event_status}>
                        <DetailRow label="Operation">{operationLabel(event.operation_id)}</DetailRow>
                        <DetailRow label="Execution">{event.execution_id ?? "—"}</DetailRow>
                        <DetailRow label="Created">{timestamp(event.created_at)}</DetailRow>
                        {Object.keys(event.event_data).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground">Event data</summary>
                            <div className="mt-2"><JsonDetail value={event.event_data} /></div>
                          </details>
                        )}
                      </RecordCard>
                    ))}
                    {data.activity_events.length === 0 && <EmptyRecords label="activity events" />}
                  </Section>
                )}

                {activeTab === "approvals" && (
                  <Section>
                    {data.approvals.map((approval) => (
                      <RecordCard key={approval.id} title={approval.reason} subtitle={approval.id} status={approval.approval_status}>
                        <DetailRow label="Device mapping">{approval.operation_device_id}</DetailRow>
                        <DetailRow label="Risk">{approval.risk_level}</DetailRow>
                        <DetailRow label="Requested by">{approval.requested_by}</DetailRow>
                        <DetailRow label="Decided by">{approval.decided_by ?? "—"}</DetailRow>
                        <DetailRow label="Requested">{timestamp(approval.requested_at)}</DetailRow>
                        <DetailRow label="Decided">{timestamp(approval.decided_at)}</DetailRow>
                        <p className="text-xs font-medium">Approved command snapshot</p>
                        <JsonDetail value={approval.commands_snapshot.join("\n")} />
                      </RecordCard>
                    ))}
                    {data.approvals.length === 0 && <EmptyRecords label="approval requests" />}
                  </Section>
                )}

                {activeTab === "evaluation" && (
                  <TaskEvaluationDetails evaluation={evaluation} error={evaluationError} />
                )}

                {activeTab === "commands" && (
                  <Section>
                    {logsError && <p role="alert" className="rounded-lg border border-amber-500/30 p-3 text-xs text-amber-600 dark:text-amber-300">{logsError}</p>}
                    {logs.map((log) => (
                      <RecordCard key={log.id} title={`#${log.sequence_number} ${deviceLabel(log.device_id)} · ${log.action_type} / ${log.action_phase}`} subtitle={log.id} status={log.action_log_status}>
                        <DetailRow label="Operation">{operationLabel(log.operation_id)}</DetailRow>
                        <DetailRow label="Execution">{log.execution_id}</DetailRow>
                        <DetailRow label="Executed">{timestamp(log.executed_at)}</DetailRow>
                        <p className="text-xs font-medium">Command</p>
                        <JsonDetail value={log.command} />
                        {log.result != null && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground">Device output</summary>
                            <div className="mt-2"><JsonDetail value={log.result} /></div>
                          </details>
                        )}
                        {log.error_message && <p className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">{log.error_message}</p>}
                      </RecordCard>
                    ))}
                    {!logsError && logs.length === 0 && <EmptyRecords label="device command logs" />}
                  </Section>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
