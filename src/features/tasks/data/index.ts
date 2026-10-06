import type { Task, TaskOperation } from "../types"
export const MOCK_TASKS: Task[] = [
  { id: "task-031026-0001-0001", conversation_id: "cons-031026-0001", source_message_id: "mesg-031026-0005", user_id: "user-011026-0001", input_message: "Kiểm tra routing table của P1 và P2, sau đó cấu hình OSPF trên P3 nếu phù hợp.", status: "RUNNING", created_at: "2026-10-03T09:31:00+07:00", completed_at: null },
  { id: "task-031026-0002-0001", conversation_id: "cons-031026-0002", source_message_id: "mesg-031026-0011", user_id: "user-011026-0002", input_message: "Kiểm tra trạng thái BGP peer trên các core router.", status: "SUCCESS", created_at: "2026-10-03T08:10:00+07:00", completed_at: "2026-10-03T08:12:14+07:00" },
  { id: "task-031026-0003-0001", conversation_id: "cons-031026-0003", source_message_id: "mesg-031026-0017", user_id: "user-011026-0003", input_message: "Backup running configuration cho toàn bộ switch access.", status: "PLANNING", created_at: "2026-10-03T09:44:00+07:00", completed_at: null },
  { id: "task-021026-0004-0001", conversation_id: "cons-021026-0004", source_message_id: "mesg-021026-0020", user_id: "user-011026-0002", input_message: "Cập nhật description cho uplink interface của SW-ACCESS-01.", status: "PARTIAL_SUCCESS", created_at: "2026-10-02T15:20:00+07:00", completed_at: "2026-10-02T15:25:48+07:00" },
  { id: "task-021026-0005-0001", conversation_id: "cons-021026-0005", source_message_id: "mesg-021026-0027", user_id: "user-011026-0001", input_message: "Thu thập CPU và memory utilization của firewall biên.", status: "FAILED", created_at: "2026-10-02T14:05:00+07:00", completed_at: "2026-10-02T14:06:07+07:00" },
]

const GENERATED_TASK_STATUSES: Task["status"][] = ["PENDING", "PLANNING", "RUNNING", "SUCCESS", "PARTIAL_SUCCESS", "FAILED", "REJECTED"]
MOCK_TASKS.push(...Array.from({ length: 24 }, (_, index): Task => ({
  id: `task-021026-${String(index + 6).padStart(4, "0")}-0001`,
  conversation_id: `cons-021026-${String(index + 6).padStart(4, "0")}`,
  source_message_id: `mesg-021026-${String(index + 30).padStart(4, "0")}`,
  user_id: `user-011026-000${index % 3 + 1}`,
  input_message: `Kiểm tra trạng thái và thu thập thông tin thiết bị branch ${String(index + 1).padStart(2, "0")}.`,
  status: GENERATED_TASK_STATUSES[index % GENERATED_TASK_STATUSES.length],
  created_at: `2026-10-02T${String(8 + index % 10).padStart(2, "0")}:00:00+07:00`,
  completed_at: index % 4 === 0 ? null : "2026-10-02T18:00:00+07:00",
})))
export const MOCK_OPERATIONS: TaskOperation[] = [
  { id: "oper-031026-0001-0001", task_id: "task-031026-0001-0001", intent: "GET_ROUTING_TABLE", display_order: 1, status: "SUCCESS", parameters: null, created_at: "2026-10-03T09:31:04+07:00", completed_at: "2026-10-03T09:31:39+07:00" },
  { id: "oper-031026-0001-0002", task_id: "task-031026-0001-0001", intent: "ANALYZE_ROUTING_DATA", display_order: 2, status: "SUCCESS", parameters: null, created_at: "2026-10-03T09:31:04+07:00", completed_at: "2026-10-03T09:32:02+07:00" },
  { id: "oper-031026-0001-0003", task_id: "task-031026-0001-0001", intent: "CONFIGURE_OSPF", display_order: 3, status: "WAITING_APPROVAL", parameters: { process_id: "1", area_id: "0", network: "10.0.0.0/24" }, created_at: "2026-10-03T09:31:04+07:00", completed_at: null },
]
