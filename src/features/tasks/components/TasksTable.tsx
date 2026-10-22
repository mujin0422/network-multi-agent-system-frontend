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

/** Màn hình theo dõi task, trạng thái thực thi và các bước cần phê duyệt. */
export function TasksTable() {
  const { rows, activeId, selected, operations, summary, setActiveId } =
    useTasksData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    task: Task | null
  }>({ open: false, mode: "view", task: null })
  const openForm = (mode: FormMode, task: Task | null = null) =>
    setForm({ open: true, mode, task })
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
              `${task.input_message} ${task.task_status} ${task.user_id} ${task.id}`
            }
            selectedRowId={activeId}
            onRowClick={(task) => setActiveId(task.id)}
            columns={[
              {
                id: "request",
                header: "Task request",
                headerClassName: "pl-4",
                className: "max-w-[380px] pl-4",
                cell: (task) => (
                  <>
                    <p className="truncate text-xs font-medium">
                      {task.input_message}
                    </p>
                    <p className="mt-1 font-mono type-caption text-muted-foreground">
                      {task.id}
                    </p>
                  </>
                ),
              },
              {
                id: "status",
                header: "Status",
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
                accessorKey: "user_id",
                className: "font-mono type-caption text-muted-foreground",
              },
              {
                id: "created",
                header: "Created",
                className: "type-caption text-muted-foreground",
                cell: (task) =>
                  new Date(task.created_at).toLocaleString("vi-VN"),
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
              <DataTableContent />
              <DataTablePagination itemLabel="tasks" />
            </DataTablePanel>
          </DataTable>
          <TaskExecutionPanel
            task={selected}
            operations={operations}
            onView={() => selected && openForm("view", selected)}
            onEdit={() => selected && openForm("edit", selected)}
          />
        </PageLayoutContent>
      </PageLayout>
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
