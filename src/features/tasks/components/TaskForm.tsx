import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FormMode } from "@/types/components"
import { TASK_STATUS_OPTIONS } from "../constants/tasks.constants"
import type { Task } from "../types/task.type"

/** Sheet tạo, xem hoặc chỉnh sửa yêu cầu và metadata của một task. */
export function TaskForm({
  open,
  mode,
  task,
  onOpenChange,
  onModeChange,
}: {
  open: boolean
  mode: FormMode
  task: Task | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
}) {
  const readOnly = mode === "view"
  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel="task"
      description="Original user request and runtime trace references."
      canEdit={!!task && ["PENDING", "PLANNING"].includes(task.task_status)}
      onEdit={() => onModeChange("edit")}
      onSubmit={() => onOpenChange(false)}
    >
      <FormField label="Request" required>
        <Textarea
          name="input_message"
          defaultValue={task?.input_message}
          disabled={readOnly}
          rows={5}
          placeholder="Describe the network operation..."
        />
      </FormField>
      {mode !== "create" && (
        <FormField label="Status">
          <FormCombobox
            name="task_status"
            defaultValue={task?.task_status}
            disabled={readOnly}
            options={TASK_STATUS_OPTIONS}
          />
        </FormField>
      )}
      <FormField label="User ID" required>
        <Input
          name="user_id"
          defaultValue={task?.user_id ?? "user-011026-0001"}
          disabled={readOnly}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Conversation ID" required>
          <Input
            name="conversation_id"
            defaultValue={task?.conversation_id}
            disabled={readOnly || mode === "create"}
            placeholder="Generated from chat"
          />
        </FormField>
        <FormField label="Source message ID" required>
          <Input
            name="source_message_id"
            defaultValue={task?.source_message_id}
            disabled={readOnly || mode === "create"}
            placeholder="Generated from message"
          />
        </FormField>
      </div>
      {task && (
        <div className="rounded-lg border bg-muted/30 p-3 type-caption text-muted-foreground">
          <p>
            Task ID: <span className="font-mono">{task.id}</span>
          </p>
          <p className="mt-1">
            Created: {new Date(task.created_at).toLocaleString("vi-VN")}
          </p>
          <p className="mt-1">
            Completed:{" "}
            {task.completed_at
              ? new Date(task.completed_at).toLocaleString("vi-VN")
              : "—"}
          </p>
        </div>
      )}
    </FeatureFormSheet>
  )
}
