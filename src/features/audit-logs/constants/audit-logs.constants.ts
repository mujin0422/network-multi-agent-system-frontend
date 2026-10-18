import type { DeviceActionPhase } from "../types/device-action-phase.type"
import type { DeviceActionStatus } from "../types/device-action-status.type"
import type { DeviceActionType } from "../types/device-action-type.type"

export const AUDIT_STATUS_LABELS: Record<DeviceActionStatus, string> = {
  SUCCESS: "Success",
  FAILED: "Failed",
  UNKNOWN: "Unknown",
}

export const AUDIT_ACTION_TYPE_LABELS: Record<DeviceActionType, string> = {
  READ: "Read",
  WRITE: "Write",
}

export const AUDIT_ACTION_PHASE_LABELS: Record<DeviceActionPhase, string> = {
  READ: "Read",
  PRE_CHECK: "Pre-check",
  APPLY: "Apply",
  POST_CHECK: "Post-check",
  ROLLBACK: "Rollback",
  ROLLBACK_VERIFY: "Rollback verification",
}

export const AUDIT_STATUS_OPTIONS = (
  Object.keys(AUDIT_STATUS_LABELS) as DeviceActionStatus[]
).map((status) => ({
  value: status,
  label: AUDIT_STATUS_LABELS[status],
}))
