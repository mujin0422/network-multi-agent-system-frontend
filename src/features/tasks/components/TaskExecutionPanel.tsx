import { Bot, Clock3, Eye, Pencil } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OPERATION_STATUS_LABELS } from "../constants/tasks.constants"
import type { TaskOperation } from "../types/task-operation.type"
import type { Task } from "../types/task.type"

export function TaskExecutionPanel({
  task,
  operations,
  onView,
  onEdit,
}: {
  task: Task
  operations: TaskOperation[]
  onView: () => void
  onEdit: () => void
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm">Execution plan</CardTitle>
            <p className="mt-1 truncate font-mono type-caption text-muted-foreground">
              {task.id}
            </p>
          </div>
          <div className="flex gap-1">
            <Button size="icon-xs" variant="ghost" onClick={onView}>
              <Eye />
            </Button>
            {["PENDING", "PLANNING"].includes(task.task_status) && (
              <Button size="icon-xs" variant="ghost" onClick={onEdit}>
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
              <div className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full border bg-card type-caption font-semibold">
                {index + 1}
              </div>
              {index < operations.length - 1 && (
                <div className="absolute left-4 top-7 h-[calc(100%-1.75rem)] w-px bg-border" />
              )}
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate type-caption font-medium">
                    {operation.operation_intent.replaceAll("_", " ")}
                  </p>
                  <StatusBadge
                    value={operation.operation_status}
                    label={OPERATION_STATUS_LABELS[operation.operation_status]}
                  />
                </div>
                {operation.operation_status === "WAITING_APPROVAL" && (
                  <ApprovalPanel />
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
  )
}

function ApprovalPanel() {
  return (
    <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
      <div className="flex items-center gap-2 type-caption text-amber-300">
        <Clock3 className="size-3" />
        Configuration approval required
      </div>
      <pre className="mt-2 type-caption text-muted-foreground">
        router ospf 1{"\n"}network 10.0.0.0 0.0.0.255 area 0
      </pre>
      <div className="mt-3 flex gap-2">
        <Button size="xs" className="flex-1">
          Approve
        </Button>
        <Button size="xs" variant="outline" className="flex-1">
          Reject
        </Button>
      </div>
    </div>
  )
}
