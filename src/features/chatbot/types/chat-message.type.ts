import type { MessageSender } from "./message-sender.type"
import type { MessageType } from "@/service"

export type ChatMessage = {
  id: string
  conversation_id: string
  reply_to_message_id: string | null
  sender_by: MessageSender
  message_type: MessageType
  message: string
  created_at: string
}
