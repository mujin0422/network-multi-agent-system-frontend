import { Send, Sparkles } from "lucide-react"
import type { KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CHAT_COPY } from "../constants/chatbot.constants"

type ChatComposerProps = {
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
}

/** Ô soạn tin nhắn, hỗ trợ gửi bằng nút hoặc phím Enter. */
export function ChatComposer({
  input,
  onInputChange,
  onSend,
}: ChatComposerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent px-3 pt-3 pb-4 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            className="max-h-36 min-h-12 resize-none rounded-2xl bg-card py-3 pr-12 pl-4 text-sm shadow-sm"
            placeholder={CHAT_COPY.placeholder}
            rows={1}
          />
          <Button
            size="icon-sm"
            aria-label="Send message"
            onClick={onSend}
            disabled={!input.trim()}
            className="absolute right-2 bottom-2 rounded-full"
          >
            <Send />
          </Button>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1 text-center text-[9px] text-muted-foreground">
          <Sparkles className="size-3" />
          AI responses may require approval before network changes are applied.
        </p>
      </div>
    </div>
  )
}
