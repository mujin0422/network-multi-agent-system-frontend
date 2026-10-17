import { useState } from "react"
import { MOCK_CONVERSATIONS } from "../mocks/conversations.mock"
import { INITIAL_MESSAGES } from "../mocks/messages.mock"
import type { ChatMessage } from "../types/chat-message.type"
import type { Conversation } from "../types/conversation.type"
import { createConversation, createUserMessage, isEmptyDraftConversation } from "../utils/chatbot.util"

// Quản lý nội dung nhập, hội thoại đang chọn và danh sách tin nhắn chatbot.
export function useChatMessages() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [activeConversationId, setActiveConversationId] = useState(MOCK_CONVERSATIONS[0].id)

  function createNewConversation() {
    const existingDraft = conversations.find((conversation) => isEmptyDraftConversation(conversation, messages))
    if (existingDraft) {
      setActiveConversationId(existingDraft.id)
      setInput("")
      return
    }

    const conversation = createConversation()
    setConversations((current) => [conversation, ...current])
    setActiveConversationId(conversation.id)
    setInput("")
  }

  // Tạo và thêm tin nhắn mới từ nội dung người dùng đang nhập.
  function sendMessage() {
    const content = input.trim()
    if (!content) return

    // Nối tin nhắn mới vào danh sách tin nhắn hiện tại.
    function appendMessage(current: ChatMessage[]) {
      return [
        ...current,
        createUserMessage(activeConversationId, content),
      ]
    }

    setMessages(appendMessage)
    setConversations((current) => current.map((conversation) => conversation.id === activeConversationId ? {
      ...conversation,
      title: conversation.title === "New conversation" ? content.slice(0, 48) : conversation.title,
      last_updated_at: new Date().toISOString(),
    } : conversation))
    setInput("")
  }
  return { input, messages, conversations, activeConversationId, createNewConversation, sendMessage, setActiveConversationId, setInput }
}
