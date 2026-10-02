import { Bot } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CHAT_COPY } from "../constants"
import { useChatMessages } from "../hooks/useChatMessages"
import { ChatComposer } from "./ChatComposer"
import { MessageList } from "./MessageList"

export function ChatContent() {
  const { input, messages, sendMessage, setInput } = useChatMessages()
  return <div className="flex min-h-[calc(100svh-7rem)] flex-col gap-4"><div><h1 className="text-[22px] font-semibold tracking-tight text-white">{CHAT_COPY.title}</h1><p className="mt-1 text-[11px] text-muted-foreground">{CHAT_COPY.description}</p></div><Card className="min-h-0 flex-1 gap-0 border-0 bg-card py-0 ring-1 ring-border"><div className="flex items-center gap-3 border-b px-4 py-3"><div className="grid size-8 place-items-center rounded-lg bg-blue-500/15 text-blue-300"><Bot className="size-4" /></div><div><p className="text-xs font-medium">Network AI</p><p className="text-[10px] text-emerald-400">● Online</p></div></div><div className="flex h-[calc(100%-57px)] min-h-[480px] flex-col"><MessageList messages={messages} /><ChatComposer input={input} onInputChange={setInput} onSend={sendMessage} /></div></Card></div>
}
