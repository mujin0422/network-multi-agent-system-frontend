import type { ChatTaskStatus } from "../types/chat-task-preview.type"
import type { MessageSender } from "../types/message-sender.type"

export const CHAT_COPY = {
  title: "AI Chatbot",
  description: "Ask questions and automate operations across your network.",
  placeholder: "Ask Network AI...",
} as const

export const MESSAGE_SENDER_LABELS: Record<MessageSender, string> = {
  USER: "User",
  AGENT: "Agent",
}

export const CHAT_TASK_STATUS_LABELS: Record<ChatTaskStatus, string> = {
  PENDING: "Pending",
  PLANNING: "Planning",
  RUNNING: "Running",
  SUCCESS: "Success",
  PARTIAL_SUCCESS: "Partial success",
  FAILED: "Failed",
  REJECTED: "Rejected",
}
