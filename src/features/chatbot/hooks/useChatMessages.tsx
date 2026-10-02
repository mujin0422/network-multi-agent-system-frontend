import { useState } from "react"
import { INITIAL_MESSAGES } from "../datas"
import type { ChatMessage } from "../types"

export function useChatMessages() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const sendMessage = () => {
    const content = input.trim()
    if (!content) return
    setMessages((current) => [...current, { role: "user", content }])
    setInput("")
  }
  return { input, messages, sendMessage, setInput }
}
