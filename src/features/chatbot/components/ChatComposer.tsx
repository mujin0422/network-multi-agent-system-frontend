import { Send } from "lucide-react"
import type { KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CHAT_COPY } from "../constants/chatbot.constants"

type ChatComposerProps = {
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

/** Ô soạn tin nhắn, hỗ trợ gửi bằng nút hoặc phím Enter. */
export function ChatComposer({
  input,
  onInputChange,
  onSend,
  disabled = false,
}: ChatComposerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent px-3 pt-2 pb-3 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            className="h-10 max-h-32 min-h-10 resize-none rounded-xl bg-card py-[11px] pr-11 pl-3 text-xs leading-4 placeholder:text-xs shadow-sm"
            placeholder={CHAT_COPY.placeholder}
            rows={1}
            disabled={disabled}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Send message"
            onClick={onSend}
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
