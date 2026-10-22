import type { ChatMessage } from "../types/chat-message.type"

export const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "mesg-031026-0001", conversation_id: "cons-031026-0001", reply_to_message_id: null, sender_by: "AGENT", message_type: "GENERAL", message: "Xin chào Thái. Tôi có thể kiểm tra trạng thái, phân tích sự cố hoặc tạo automation task cho hạ tầng mạng. Bạn muốn bắt đầu với việc gì?", created_at: "2026-10-03T09:29:00+07:00" },
  { id: "mesg-031026-0005", conversation_id: "cons-031026-0001", reply_to_message_id: null, sender_by: "USER", message_type: "USER_REQUEST", message: "Kiểm tra routing table của P1 và P2, sau đó cấu hình OSPF trên P3 nếu phù hợp.", created_at: "2026-10-03T09:31:00+07:00" },
  { id: "mesg-031026-0006", conversation_id: "cons-031026-0001", reply_to_message_id: "mesg-031026-0005", sender_by: "AGENT", message_type: "APPROVAL_REQUEST", message: "Tôi đã lập kế hoạch gồm 3 bước. Routing table trên P1 và P2 đã được thu thập và phân tích thành công. Cấu hình OSPF dự kiến trên P3 đang chờ bạn phê duyệt.", created_at: "2026-10-03T09:32:05+07:00" },
]
