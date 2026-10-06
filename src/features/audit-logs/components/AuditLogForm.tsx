import {
  FeatureFormSheet,
  FormField,
  type FormMode,
} from "@/components/common/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { DeviceActionLog } from "../types"

/** Sheet chỉ đọc dùng để xem command, kết quả và trace của audit log. */
export function AuditLogForm({open, mode, log, onOpenChange}: {
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
          <Input value={log?.status ?? ""} disabled />
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
        <div className="rounded-lg border bg-muted/30 p-3 text-[10px] text-muted-foreground">
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
