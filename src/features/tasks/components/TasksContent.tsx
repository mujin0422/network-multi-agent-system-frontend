import {
  Bot,
  CheckCircle2,
  Clock3,
  Eye,
  ListChecks,
  Pencil,
  Play,
  ShieldAlert,
} from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MOCK_OPERATIONS, MOCK_TASKS } from "../data"
import { useTasksData } from "../hooks/useTasksData"
import type { Task } from "../types"
import { TaskForm } from "./TaskForm"

/** Màn hình theo dõi task, trạng thái thực thi và các bước cần phê duyệt. */
export function TasksContent() {
  const {
    query,
    rows,
    pagination,
    status,
    activeId,
    setQuery,
    setStatus,
    setActiveId,
  } = useTasksData()
  const selected =
    MOCK_TASKS.find((task) => task.id === activeId) ?? MOCK_TASKS[0]
  const operations = MOCK_OPERATIONS.filter(
    (item) => item.task_id === selected.id,
  )
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    task: Task | null
  }>({ open: false, mode: "view", task: null })
  const openForm = (mode: FormMode, task: Task | null = null) =>
    setForm({ open: true, mode, task })
  return (
    <>
      <div className="space-y-5">
        <FeatureHeader
          title="Tasks"
          description="Track AI plans, execution progress, and human approvals."
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total tasks"
            value="5"
            detail="Last 48 hours"
            icon={ListChecks}
          />
          <StatCard
            label="In progress"
            value="2"
            detail="Running and planning"
            icon={Play}
          />
          <StatCard
            label="Completed"
            value="1"
            detail="100% successful"
            icon={CheckCircle2}
            tone="green"
          />
          <StatCard
            label="Needs attention"
            value="2"
            detail="1 failed, 1 partial"
            icon={ShieldAlert}
            tone="amber"
          />
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.85fr)]">
          <Card className="gap-0 py-0">
            <TableToolbar
              query={query}
              onQueryChange={setQuery}
              placeholder="Search tasks, status, owner..."
            >
              <FilterCombobox
                value={status}
                onValueChange={setStatus}
                ariaLabel="Filter by status"
                className="min-w-44"
                options={[
                  { value: "ALL", label: "All statuses" },
                  { value: "PENDING", label: "PENDING" },
                  { value: "PLANNING", label: "PLANNING" },
                  { value: "RUNNING", label: "RUNNING" },
                  { value: "SUCCESS", label: "SUCCESS" },
                  { value: "PARTIAL_SUCCESS", label: "PARTIAL_SUCCESS" },
                  { value: "FAILED", label: "FAILED" },
                  { value: "REJECTED", label: "REJECTED" },
                ]}
              />
            </TableToolbar>
            <Table>
              <TableHeader>
                <TableRow className="text-[10px] uppercase text-muted-foreground">
                  <TableHead className="pl-4">Task request</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((task) => (
                  <TableRow
                    key={task.id}
                    onClick={() => setActiveId(task.id)}
                    className={
                      activeId === task.id ? "bg-muted/50" : "cursor-pointer"
                    }
                  >
                    <TableCell className="max-w-[380px] pl-4">
                      <p className="truncate text-xs font-medium">
                        {task.input_message}
                      </p>
                      <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                        {task.id}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={task.status} />
                    </TableCell>
                    <TableCell className="font-mono text-[9px] text-muted-foreground">
                      {task.user_id}
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">
                      {new Date(task.created_at).toLocaleString("vi-VN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DataPagination {...pagination} onPageChange={pagination.setPage} />
          </Card>
          <Card className="gap-0 py-0">
            <CardHeader className="border-b py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">Execution plan</CardTitle>
                  <p className="mt-1 truncate font-mono text-[9px] text-muted-foreground">
                    {selected.id}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => openForm("view", selected)}
                  >
                    <Eye />
                  </Button>
                  {["PENDING", "PLANNING"].includes(selected.status) && (
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => openForm("edit", selected)}
                    >
                      <Pencil />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 p-4">
              {operations.length ? (
                operations.map((operation, index) => (
                  <div
                    key={operation.id}
                    className="relative flex gap-3 pb-5 last:pb-0"
                  >
                    <div className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full border bg-card text-[10px] font-semibold">
                      {index + 1}
                    </div>
                    {index < operations.length - 1 && (
                      <div className="absolute left-3.5 top-7 h-[calc(100%-1.75rem)] w-px bg-border" />
                    )}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[11px] font-medium">
                          {operation.intent.replaceAll("_", " ")}
                        </p>
                        <StatusBadge value={operation.status} />
                      </div>
                      {operation.status === "WAITING_APPROVAL" && (
                        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                          <div className="flex items-center gap-2 text-[10px] text-amber-300">
                            <Clock3 className="size-3" />
                            Configuration approval required
                          </div>
                          <pre className="mt-2 text-[9px] text-muted-foreground">
                            router ospf 1{"\n"} network 10.0.0.0 0.0.0.255 area
                            0
                          </pre>
                          <div className="mt-3 flex gap-2">
                            <Button size="xs" className="flex-1">
                              Approve
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              className="flex-1"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <Bot className="mx-auto size-6 text-muted-foreground" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Execution details are archived.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <TaskForm
        open={form.open}
        mode={form.mode}
        task={form.task}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
        onModeChange={(mode) => setForm((current) => ({ ...current, mode }))}
      />
    </>
  )
}
