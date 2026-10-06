export type Conversation = { id: string; user_id: string; title: string; created_at: string; last_updated_at: string }
export type MessageSender = "USER" | "AGENT"
export type ChatMessage = { id: string; conversation_id: string; sender_by: MessageSender; message: string; created_at: string; task_id?: string; task_status?: "RUNNING" | "SUCCESS" | "WAITING_APPROVAL" }
