import { Send } from "lucide-react"
import { useState, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CHAT_COPY } from "../constants/chatbot.constants"

type ChatComposerProps = {
  initialValue?: string
  onSend: (content: string) => Promise<boolean>
  disabled?: boolean
}

/** Ô soạn tin nhắn, hỗ trợ gửi bằng nút hoặc phím Enter. */
export function ChatComposer({
  initialValue = "",
  onSend,
  disabled = false,
}: ChatComposerProps) {
  const [input, setInput] = useState(initialValue)

  const handleSend = async () => {
    const content = input.trim()
    if (!content || disabled) return
    if (await onSend(content)) setInput("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void handleSend()
    }
  }

  return (
    <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent px-3 pt-2 pb-3 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="h-10 max-h-32 min-h-10 resize-none overflow-y-auto rounded-xl bg-card py-[11px] pr-11 pl-3 text-xs leading-4 placeholder:text-xs shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            placeholder={CHAT_COPY.placeholder}
            rows={1}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
            disabled={disabled}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Send message"
            onClick={() => void handleSend()}
            disabled={disabled || !input.trim()}
            className="absolute top-1/2 right-1 -translate-y-1/2 rounded-none bg-transparent text-white shadow-none hover:bg-transparent hover:text-white"
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  )
}
