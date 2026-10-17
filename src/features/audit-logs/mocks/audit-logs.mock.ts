import type { DeviceActionLog } from "../types/device-action-log.type"
export const MOCK_DEVICE_ACTION_LOGS: DeviceActionLog[] = [
  { id: "7c8512ae-3ee7-4cc5-a7ce-f28122101ee1", task_id: "task-031026-0001-0001", operation_id: "oper-031026-0001-0001", operation_device_id: "oper-devv-031026-0001-0001", execution_id: "exec-031026-0001-0001", device_id: "devc-031026-0001", action_type: "READ", action_phase: "PRE_CHECK", command: "show ip route", result: "Gateway of last resort is 10.10.0.1...", action_log_status: "SUCCESS", error_message: null, executed_at: "2026-10-03T09:31:22+07:00" },
  { id: "382d7385-2a86-42ca-ae9a-99f28236ee02", task_id: "task-031026-0001-0001", operation_id: "oper-031026-0001-0001", operation_device_id: "oper-devv-031026-0001-0002", execution_id: "exec-031026-0001-0002", device_id: "devc-031026-0002", action_type: "READ", action_phase: "PRE_CHECK", command: "show ip route", result: "Codes: L - local, C - connected...", action_log_status: "SUCCESS", error_message: null, executed_at: "2026-10-03T09:31:23+07:00" },
  { id: "ba0eb165-e38a-471b-bf75-e9cdef614f03", task_id: "task-031026-0002-0001", operation_id: "oper-031026-0002-0001", operation_device_id: "oper-devv-031026-0002-0001", execution_id: "exec-031026-0002-0001", device_id: "devc-031026-0001", action_type: "READ", action_phase: "PRE_CHECK", command: "show ip bgp summary", result: "BGP router identifier 10.10.0.11...", action_log_status: "SUCCESS", error_message: null, executed_at: "2026-10-03T08:11:04+07:00" },
  { id: "cf742841-e06e-4444-9f2f-b56710c28104", task_id: "task-021026-0005-0001", operation_id: "oper-021026-0005-0001", operation_device_id: "oper-devv-021026-0005-0001", execution_id: "exec-021026-0005-0001", device_id: "devc-031026-0004", action_type: "READ", action_phase: "PRE_CHECK", command: "get system performance status", result: null, action_log_status: "UNKNOWN", error_message: "SSH connection timed out after 30 seconds", executed_at: "2026-10-02T14:05:36+07:00" },
  { id: "0986ff2d-cd77-4127-bf59-9e1c4a23de05", task_id: "task-021026-0004-0001", operation_id: "oper-021026-0004-0002", operation_device_id: "oper-devv-021026-0004-0001", execution_id: "exec-021026-0004-0003", device_id: "devc-031026-0003", action_type: "WRITE", action_phase: "APPLY", command: "set interfaces ge-0/0/0 description CORE-UPLINK", result: "commit complete", action_log_status: "SUCCESS", error_message: null, executed_at: "2026-10-02T15:24:08+07:00" },
]

MOCK_DEVICE_ACTION_LOGS.push(...Array.from({ length: 28 }, (_, index): DeviceActionLog => ({
  id: `00000000-0000-4000-8000-${String(index + 6).padStart(12, "0")}`,
  task_id: `task-021026-${String(index + 6).padStart(4, "0")}-0001`,
  operation_id: `oper-021026-${String(index + 6).padStart(4, "0")}-0001`,
  operation_device_id: `oper-devv-021026-${String(index + 6).padStart(4, "0")}-0001`,
  execution_id: `exec-021026-${String(index + 6).padStart(4, "0")}-0001`,
  device_id: `devc-021026-${String(index % 22 + 6).padStart(4, "0")}`,
  action_type: "READ",
  action_phase: "PRE_CHECK",
  command: index % 3 === 0 ? "show ip interface brief" : index % 3 === 1 ? "show version" : "show running-config | include hostname",
  result: index % 9 === 0 ? null : "Command completed successfully",
  action_log_status: index % 9 === 0 ? "FAILED" : "SUCCESS",
  error_message: index % 9 === 0 ? "Device connection timed out" : null,
  executed_at: `2026-10-03T${String(7 + index % 5).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}:00+07:00`,
})))
