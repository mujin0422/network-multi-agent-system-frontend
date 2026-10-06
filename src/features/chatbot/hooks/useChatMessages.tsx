import { useState } from "react"
import { INITIAL_MESSAGES, MOCK_CONVERSATIONS } from "../data"
import type { ChatMessage } from "../types"

export function useChatMessages() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [activeConversationId, setActiveConversationId] = useState(MOCK_CONVERSATIONS[0].id)
  const sendMessage = () => {
    const content = input.trim()
    if (!content) return
    setMessages((current) => [...current, { id: `mesg-local-${Date.now()}`, conversation_id: activeConversationId, sender_by: "USER", message: content, created_at: new Date().toISOString() }])
    setInput("")
  }
  return { input, messages, conversations: MOCK_CONVERSATIONS, activeConversationId, sendMessage, setActiveConversationId, setInput }
}
