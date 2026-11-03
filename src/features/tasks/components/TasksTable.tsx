import { TableIdentifier } from "@/components/shared/TableIdentifier"
import { MoreMenu } from "@/components/shared/MoreMenu"
import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
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
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_OPTIONS,
} from "../constants/tasks.constants"
import { useTasksData } from "../hooks/use-tasks-data"
import type { Task } from "../types/task.type"
import { TaskForm } from "./TaskForm"
import { TaskStats } from "./TaskStats"
import { TaskExecutionPanel } from "./TaskExecutionPanel"
import { TaskRecordsSheet } from "./TaskRecordsSheet"

/** Màn hình theo dõi task, trạng thái thực thi và các bước cần phê duyệt. */
export function TasksTable() {
  const { rows, usersById, activeId, selected, operations, summary, setActiveId, loading } = useTasksData()
  const [recordsTaskId, setRecordsTaskId] = useState<string | null>(null)
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    task: Task | null
  }>({ open: false, mode: "view", task: null })
  const openForm = (mode: FormMode, task: Task | null = null) =>
    setForm({ open: true, mode, task })
  const auditTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "—"
    const date = new Date(timestamp)
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleString("vi-VN")
  }
  if (loading) {
    return (
      <PageLoadingSkeleton
        title="Tasks"
        description="Track AI plans, execution progress, and human approvals."
        stats={4}
      variant="split"
      />
    )
  }

  return (
    <>
      <PageLayout>
        <PageLayoutHeader
          title="Tasks"
          description="Track AI plans, execution progress, and human approvals."
        />
        <TaskStats summary={summary} />
        <PageLayoutContent className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.85fr)]">
          <DataTable
            data={rows}
            getRowId={(task) => task.id}
            filters={[
              {
                id: "status",
                label: "status",
                accessorKey: "task_status",
                allLabel: "All statuses",
                options: TASK_STATUS_OPTIONS,
              },
            ]}
            searchValue={(task) =>
              `${task.input_message} ${task.task_status} ${usersById.get(task.user_id)?.full_name ?? ""} ${usersById.get(task.user_id)?.email ?? ""} ${task.id}`
            }
            selectedRowId={activeId}
            onRowClick={(task) => setActiveId(task.id)}
            columns={[
              {
                id: "request",
                header: "Task request",
                headerClassName: "w-[23%] pl-4",
                className: "w-[23%] pl-4"
                cell: (task) => (
                  <div className="min-w-0 max-w-full">
                    <p className="max-w-full truncate text-xs font-medium" title={task.input_message}>{task.input_message}</p>
                    <TableIdentifier value={task.id} className="mt-1 max-w-full truncate" />
                  </div>
                ),
              },
              {
                id: "status",
                header: "Status",
                headerClassName: "w-[19%]",
                className: "w-[19%]",
                cell: (task) => (
                  <StatusBadge
                    value={task.task_status}
                    label={TASK_STATUS_LABELS[task.task_status]}
                  />
                ),
              },
              {
                id: "owner",
                header: "Owner",
                headerClassName: "hidden w-[28%] md:table-cell",
                className: "hidden w-[28%] md:table-cell",
                cell: (task) => {
                  const owner = usersById.get(task.user_id)
                  return (
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {owner?.full_name ?? "Unknown user"}
                      </p>
                      <p className="mt-1 truncate type-caption text-muted-foreground">
                        {owner?.email ?? "—"}
                      </p>
                    </div>
                  )
                },
              },
              {
                id: "timestamp",
                header: "Timestamp",
                headerClassName: "hidden w-[24%] md:table-cell",
                className: "hidden w-[24%] text-muted-foreground md:table-cell",
                cell: (task) =>
                  <div className="type-micro space-y-1 whitespace-nowrap">
                    <p>
                      <span className="font-medium text-foreground"> Created at: </span>
                      {auditTimestamp(task.created_at)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground"> Started at: </span>
                      {auditTimestamp(task.started_at)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground"> Completed at: </span>
                      {auditTimestamp(task.completed_at)} 
                    </p>
                  </div>
              },
              {
                id: "actions",
                header: null,
                headerClassName: "w-[6%] px-2 text-right",
                className: "w-[6%] px-2 text-right",
                cell: (task) => (
                  <div
                    className="flex justify-end"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <MoreMenu
                      onCopy={() => void navigator.clipboard?.writeText(task.id)}
                      onView={() => {
                        setActiveId(task.id)
                        setRecordsTaskId(task.id)
                      }}
                    />
                  </div>
                ),
              },
            ]}
          >
            <DataTablePanel>
              <DataTableToolbar>
                <DataTableSearch placeholder="Search tasks, status, owner..." />
                <DataTableToolbarActions>
                  <DataTableFilters />
                </DataTableToolbarActions>
              </DataTableToolbar>
              <DataTableContent className="table-fixed" />
              <DataTablePagination itemLabel="tasks" />
            </DataTablePanel>
          </DataTable>
          <TaskExecutionPanel
            task={selected}
            operations={operations}
            onEdit={() => selected && openForm("edit", selected)}
          />
        </PageLayoutContent>
      </PageLayout>
      <TaskRecordsSheet
        open={recordsTaskId !== null}
        taskId={recordsTaskId}
        onOpenChange={(open) => {
          if (!open) setRecordsTaskId(null)
        }}
      />
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
