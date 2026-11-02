import { Dialog } from "@base-ui/react/dialog"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ConversationTitleDialogProps } from "../types/conversation-title-dialog-props.type"

/** Dialog đổi tiêu đề conversation được mở bằng thao tác double-click. */
export function ConversationTitleDialog({
  open,
  title,
  onOpenChange,
  onSave,
}: ConversationTitleDialogProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(title)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    window.requestAnimationFrame(() => inputRef.current?.select())
  }, [open])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedTitle = value.trim()
    if (!normalizedTitle || normalizedTitle === title || saving) return
    setSaving(true)
    setError(null)
    try {
      await onSave(normalizedTitle)
      onOpenChange(false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("chatbot.rename.error"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl transition duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <Dialog.Title className="text-sm font-medium">
            {t("chatbot.rename.title")}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-xs text-muted-foreground">
            {t("chatbot.rename.description")}
          </Dialog.Description>

          <form className="mt-4 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <Input
              ref={inputRef}
              value={value}
              maxLength={100}
              className="text-xs placeholder:text-xs"
              placeholder={t("chatbot.rename.placeholder")}
              onChange={(event) => setValue(event.target.value)}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Dialog.Close
                render={<Button type="button" size="sm" variant="outline" />}
              >
                {t("common.cancel")}
              </Dialog.Close>
              <Button
                type="submit"
                size="sm"
                disabled={!value.trim() || value.trim() === title || saving}
              >
                {t("common.saveChanges")}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
