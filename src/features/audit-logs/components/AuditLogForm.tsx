import {
  FeatureFormSheet,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FormMode } from "@/types/components"
import {
  AUDIT_ACTION_PHASE_LABELS,
  AUDIT_ACTION_TYPE_LABELS,
  AUDIT_STATUS_LABELS,
} from "../constants/audit-logs.constants"
import type { DeviceActionLog } from "../types/device-action-log.type"

/** Sheet chỉ đọc dùng để xem command, kết quả và trace của audit log. */
export function AuditLogForm({
  open,
  mode,
  log,
  onOpenChange,
}: {
  open: boolean
  mode: FormMode
  log: DeviceActionLog | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel="audit log"
      description="Audit logs are immutable and available in view mode only."
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Device ID">
          <Input value={log?.device_id ?? ""} disabled />
        </FormField>
        <FormField label="Status">
          <Input
            value={log ? AUDIT_STATUS_LABELS[log.action_log_status] : ""}
            disabled
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Action type">
          <Input
            value={log ? AUDIT_ACTION_TYPE_LABELS[log.action_type] : ""}
            disabled
          />
        </FormField>
        <FormField label="Action phase">
          <Input
            value={log ? AUDIT_ACTION_PHASE_LABELS[log.action_phase] : ""}
            disabled
          />
        </FormField>
      </div>
      <FormField label="Command">
        <Textarea
          value={log?.command ?? ""}
          disabled
          rows={4}
          className="font-mono text-xs"
        />
      </FormField>
      <FormField label="Result">
        <Textarea
          value={log?.result ?? log?.error_message ?? ""}
          disabled
          rows={6}
          className="font-mono text-xs"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Task ID">
          <Input value={log?.task_id ?? ""} disabled />
        </FormField>
        <FormField label="Operation ID">
          <Input value={log?.operation_id ?? ""} disabled />
        </FormField>
        <FormField label="Operation device ID">
          <Input value={log?.operation_device_id ?? ""} disabled />
        </FormField>
        <FormField label="Execution ID">
          <Input value={log?.execution_id ?? ""} disabled />
        </FormField>
      </div>
      {log && (
        <div className="rounded-lg border bg-muted/30 p-3 type-caption text-muted-foreground">
          <p>
            UUID: <span className="font-mono">{log.id}</span>
          </p>
          <p className="mt-1">
            Executed: {new Date(log.executed_at).toLocaleString("vi-VN")}
          </p>
        </div>
      )}
    </FeatureFormSheet>
  )
}
