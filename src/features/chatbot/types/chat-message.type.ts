import type { MessageSender } from "./message-sender.type"

export type ChatMessage = {
  id: string
  conversation_id: string
  sender_by: MessageSender
  message: string
  created_at: string
}
