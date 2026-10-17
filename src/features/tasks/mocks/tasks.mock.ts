import type { Task } from "../types/task.type"
export const MOCK_TASKS: Task[] = [
  { id: "task-031026-0001-0001", conversation_id: "cons-031026-0001", source_message_id: "mesg-031026-0005", user_id: "user-011026-0001", task_type: "INFORMATION_RETRIEVAL", input_message: "Kiểm tra routing table của P1 và P2, sau đó cấu hình OSPF trên P3 nếu phù hợp.", task_status: "RUNNING", created_at: "2026-10-03T09:31:00+07:00", completed_at: null },
  { id: "task-031026-0002-0001", conversation_id: "cons-031026-0002", source_message_id: "mesg-031026-0011", user_id: "user-011026-0002", task_type: "INFORMATION_RETRIEVAL", input_message: "Kiểm tra trạng thái BGP peer trên các core router.", task_status: "SUCCESS", created_at: "2026-10-03T08:10:00+07:00", completed_at: "2026-10-03T08:12:14+07:00" },
  { id: "task-031026-0003-0001", conversation_id: "cons-031026-0003", source_message_id: "mesg-031026-0017", user_id: "user-011026-0003", task_type: "INFORMATION_RETRIEVAL", input_message: "Backup running configuration cho toàn bộ switch access.", task_status: "PLANNING", created_at: "2026-10-03T09:44:00+07:00", completed_at: null },
  { id: "task-021026-0004-0001", conversation_id: "cons-021026-0004", source_message_id: "mesg-021026-0020", user_id: "user-011026-0002", task_type: "INFORMATION_RETRIEVAL", input_message: "Cập nhật description cho uplink interface của SW-ACCESS-01.", task_status: "PARTIAL_SUCCESS", created_at: "2026-10-02T15:20:00+07:00", completed_at: "2026-10-02T15:25:48+07:00" },
  { id: "task-021026-0005-0001", conversation_id: "cons-021026-0005", source_message_id: "mesg-021026-0027", user_id: "user-011026-0001", task_type: "INFORMATION_RETRIEVAL", input_message: "Thu thập CPU và memory utilization của firewall biên.", task_status: "FAILED", created_at: "2026-10-02T14:05:00+07:00", completed_at: "2026-10-02T14:06:07+07:00" },
]

const GENERATED_TASK_STATUSES: Task["task_status"][] = ["PENDING", "PLANNING", "RUNNING", "SUCCESS", "PARTIAL_SUCCESS", "FAILED", "REJECTED"]
MOCK_TASKS.push(...Array.from({ length: 24 }, (_, index): Task => ({
  id: `task-021026-${String(index + 6).padStart(4, "0")}-0001`,
  conversation_id: `cons-021026-${String(index + 6).padStart(4, "0")}`,
  source_message_id: `mesg-021026-${String(index + 30).padStart(4, "0")}`,
  user_id: `user-011026-000${index % 3 + 1}`,
  task_type: "INFORMATION_RETRIEVAL",
  input_message: `Kiểm tra trạng thái và thu thập thông tin thiết bị branch ${String(index + 1).padStart(2, "0")}.`,
  task_status: GENERATED_TASK_STATUSES[index % GENERATED_TASK_STATUSES.length],
  created_at: `2026-10-02T${String(8 + index % 10).padStart(2, "0")}:00:00+07:00`,
  completed_at: index % 4 === 0 ? null : "2026-10-02T18:00:00+07:00",
})))
