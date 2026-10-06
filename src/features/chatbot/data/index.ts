import type { ChatMessage, Conversation } from "../types"
export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "cons-031026-0001", user_id: "user-011026-0001", title: "Kiểm tra routing core network", created_at: "2026-10-03T09:29:00+07:00", last_updated_at: "2026-10-03T09:32:05+07:00" },
  { id: "cons-031026-0002", user_id: "user-011026-0001", title: "BGP peer health check", created_at: "2026-10-03T08:09:00+07:00", last_updated_at: "2026-10-03T08:12:20+07:00" },
  { id: "cons-021026-0003", user_id: "user-011026-0001", title: "Switch configuration backup", created_at: "2026-10-02T16:00:00+07:00", last_updated_at: "2026-10-02T16:08:00+07:00" },
]
export const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "mesg-031026-0001", conversation_id: "cons-031026-0001", sender_by: "AGENT", message: "Xin chào Thái. Tôi có thể kiểm tra trạng thái, phân tích sự cố hoặc tạo automation task cho hạ tầng mạng. Bạn muốn bắt đầu với việc gì?", created_at: "2026-10-03T09:29:00+07:00" },
  { id: "mesg-031026-0005", conversation_id: "cons-031026-0001", sender_by: "USER", message: "Kiểm tra routing table của P1 và P2, sau đó cấu hình OSPF trên P3 nếu phù hợp.", created_at: "2026-10-03T09:31:00+07:00" },
  { id: "mesg-031026-0006", conversation_id: "cons-031026-0001", sender_by: "AGENT", message: "Tôi đã lập kế hoạch gồm 3 bước. Routing table trên P1 và P2 đã được thu thập và phân tích thành công. Cấu hình OSPF dự kiến trên P3 đang chờ bạn phê duyệt.", created_at: "2026-10-03T09:32:05+07:00", task_id: "task-031026-0001-0001", task_status: "WAITING_APPROVAL" },
]
