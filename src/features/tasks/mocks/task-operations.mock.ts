import type { TaskOperation } from "../types/task-operation.type"

export const MOCK_OPERATIONS: TaskOperation[] = [
  { id: "oper-031026-0001-0001", task_id: "task-031026-0001-0001", operation_intent: "GET_ROUTING_TABLE", display_order: 1, operation_status: "SUCCESS", operation_parameters: null, created_at: "2026-10-03T09:31:04+07:00", completed_at: "2026-10-03T09:31:39+07:00" },
  { id: "oper-031026-0001-0002", task_id: "task-031026-0001-0001", operation_intent: "ANALYZE_ROUTING_DATA", display_order: 2, operation_status: "SUCCESS", operation_parameters: null, created_at: "2026-10-03T09:31:04+07:00", completed_at: "2026-10-03T09:32:02+07:00" },
  { id: "oper-031026-0001-0003", task_id: "task-031026-0001-0001", operation_intent: "CONFIGURE_OSPF", display_order: 3, operation_status: "WAITING_APPROVAL", operation_parameters: { process_id: "1", area_id: "0", network: "10.0.0.0/24" }, created_at: "2026-10-03T09:31:04+07:00", completed_at: null },
]
