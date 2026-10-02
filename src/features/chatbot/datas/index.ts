import type { ChatMessage } from "../types"

export const INITIAL_MESSAGES: ChatMessage[] = [
  { role: "assistant", content: "Hello! I can help you inspect devices, troubleshoot connectivity, or create an automation task. What would you like to do?" },
  { role: "user", content: "Check the health of the core network." },
  { role: "assistant", content: "All core devices are reachable. P3 has elevated latency at 31 ms, but its routing sessions remain stable." },
]
