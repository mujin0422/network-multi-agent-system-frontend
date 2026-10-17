import type { ChatMessage } from "../types/chat-message.type"
import type { Conversation } from "../types/conversation.type"

export function createConversation(): Conversation {
  const now = new Date().toISOString()

  return {
    id: `cons-local-${Date.now()}`,
    user_id: "user-011026-0001",
    title: "New conversation",
    created_at: now,
    last_updated_at: now,
  }
}

export function createUserMessage(conversationId: string, message: string): ChatMessage {
  return {
    id: `mesg-local-${Date.now()}`,
    conversation_id: conversationId,
    sender_by: "USER",
    message,
    created_at: new Date().toISOString(),
  }
}

export function isEmptyDraftConversation(conversation: Conversation, messages: ChatMessage[]) {
  return conversation.title === "New conversation" && !messages.some((message) => message.conversation_id === conversation.id)
}

export function formatMessageTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
