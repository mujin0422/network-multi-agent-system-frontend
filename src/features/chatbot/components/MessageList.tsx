import type { ChatMessage } from "../types"

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}><div className={message.role === "user" ? "max-w-[80%] rounded-2xl rounded-br-sm bg-blue-500 px-3.5 py-2.5 text-xs text-white" : "max-w-[80%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-xs leading-relaxed text-[#dde3ea]"}>{message.content}</div></div>)}</div>
}
