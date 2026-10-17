import type { DeviceActionPhase } from "./device-action-phase.type"
import type { DeviceActionStatus } from "./device-action-status.type"
import type { DeviceActionType } from "./device-action-type.type"

export type DeviceActionLog = {
  id: string
  task_id: string
  operation_id: string
  operation_device_id: string
  execution_id: string
  device_id: string
  action_type: DeviceActionType
  action_phase: DeviceActionPhase
  command: string
  result: string | null
  action_log_status: DeviceActionStatus
  error_message: string | null
  executed_at: string
}
