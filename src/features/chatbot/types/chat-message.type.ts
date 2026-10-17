import type { MessageSender } from "./message-sender.type"

export type ChatMessage = { id: string; conversation_id: string; sender_by: MessageSender; message: string; created_at: string; task_id?: string; task_status?: "RUNNING" | "SUCCESS" | "WAITING_APPROVAL" }
