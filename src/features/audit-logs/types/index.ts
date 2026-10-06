export type DeviceActionStatus = "SUCCESS" | "FAILED"
export type DeviceActionLog = { id: string; task_id: string; operation_id: string; operation_device_id: string; execution_id: string; device_id: string; command: string; result: string | null; status: DeviceActionStatus; error_message: string | null; executed_at: string }
