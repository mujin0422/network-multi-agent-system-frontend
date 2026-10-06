import { Paperclip, Send, Sparkles } from "lucide-react"
import type { KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CHAT_COPY } from "../constants"

type ChatComposerProps = {
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
}

/** Ô soạn tin nhắn, hỗ trợ gửi bằng nút hoặc phím Enter. */
export function ChatComposer({ input, onInputChange, onSend }: ChatComposerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="border-t p-3 sm:p-4">
      <div className="flex items-end gap-2 rounded-xl border bg-background p-2">
        <Button variant="ghost" size="icon-sm" aria-label="Attach file">
          <Paperclip />
        </Button>
        <Textarea value={input} onChange={(event) => onInputChange(event.target.value)} onKeyDown={handleKeyDown} className="min-h-8 resize-none border-0 bg-transparent px-1 py-1.5 text-xs shadow-none focus-visible:ring-0" placeholder={CHAT_COPY.placeholder} rows={1} />
        <Button size="icon" aria-label="Send message" onClick={onSend}>
          <Send />
        </Button>
      </div>
      <p className="mt-2 flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
        <Sparkles className="size-3" />
        AI responses may require approval before network changes are applied.
      </p>
    </div>
  )
}
