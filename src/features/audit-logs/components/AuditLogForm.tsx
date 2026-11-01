import {
  FeatureFormSheet,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FormMode } from "@/types/components"
import {
  AUDIT_ACTOR_TYPE_LABELS,
  AUDIT_STATUS_LABELS,
} from "../constants/audit-logs.constants"
import type { AuditLog } from "../types/audit-log.type"

/** Sheet chỉ đọc dùng để kiểm tra đầy đủ ngữ cảnh của một sự kiện audit. */
export function AuditLogForm({
  open,
  mode,
  log,
  onOpenChange,
}: {
  open: boolean
  mode: FormMode
  log: AuditLog | null
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
        <FormField label="Actor">
          <Input value={log?.actor_display_name ?? "System"} disabled />
        </FormField>
        <FormField label="Status">
          <Input
            value={log ? AUDIT_STATUS_LABELS[log.event_status] : ""}
            disabled
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Actor type">
          <Input
            value={log ? AUDIT_ACTOR_TYPE_LABELS[log.actor_type] : ""}
            disabled
          />
        </FormField>
        <FormField label="Actor user ID">
          <Input value={log?.actor_user_id ?? ""} disabled />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Action">
          <Input value={log?.action ?? ""} disabled className="font-mono" />
        </FormField>
        <FormField label="Resource type">
          <Input value={log?.resource_type ?? ""} disabled />
        </FormField>
        <FormField label="Resource ID">
          <Input value={log?.resource_id ?? ""} disabled className="font-mono" />
        </FormField>
        <FormField label="Request ID">
          <Input value={log?.request_id ?? ""} disabled className="font-mono" />
        </FormField>
      </div>
      <FormField label="Summary">
        <Textarea value={log?.summary ?? ""} disabled rows={3} />
      </FormField>
      <FormField label="Event data">
        <Textarea
          value={log ? JSON.stringify(log.event_data, null, 2) : ""}
          disabled
          rows={8}
          className="font-mono text-xs"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Source IP">
          <Input value={log?.source_ip ?? ""} disabled />
        </FormField>
        <FormField label="User agent">
          <Input value={log?.user_agent ?? ""} disabled />
        </FormField>
      </div>
      {log && (
        <div className="rounded-lg border bg-muted/30 p-3 type-caption text-muted-foreground">
          <p>
            UUID: <span className="font-mono">{log.id}</span>
          </p>
          <p className="mt-1">
            Occurred: {new Date(log.occurred_at).toLocaleString("vi-VN")}
          </p>
        </div>
      )}
    </FeatureFormSheet>
  )
}
