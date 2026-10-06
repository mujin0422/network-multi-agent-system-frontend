import { useState } from "react"
import { INITIAL_MESSAGES, MOCK_CONVERSATIONS } from "../data"
import type { ChatMessage } from "../types"

// Quản lý nội dung nhập, hội thoại đang chọn và danh sách tin nhắn chatbot.
export function useChatMessages() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [activeConversationId, setActiveConversationId] = useState(MOCK_CONVERSATIONS[0].id)
  // Tạo và thêm tin nhắn mới từ nội dung người dùng đang nhập.
  function sendMessage() {
    const content = input.trim()
    if (!content) return

    // Nối tin nhắn mới vào danh sách tin nhắn hiện tại.
    function appendMessage(current: ChatMessage[]) {
      return [
        ...current,
        {
          id: `mesg-local-${Date.now()}`,
          conversation_id: activeConversationId,
          sender_by: "USER" as const,
          message: content,
          created_at: new Date().toISOString(),
        },
      ]
    }

    setMessages(appendMessage)
    setInput("")
  }
  return { input, messages, conversations: MOCK_CONVERSATIONS, activeConversationId, sendMessage, setActiveConversationId, setInput }
}
