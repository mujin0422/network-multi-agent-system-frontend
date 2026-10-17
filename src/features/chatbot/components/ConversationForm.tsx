import {
  FeatureFormSheet,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FormMode } from "@/types/components"
import type { Conversation } from "../types/conversation.type"

/** Sheet tạo mới, xem hoặc chỉnh sửa thông tin một cuộc hội thoại. */
export function ConversationForm({
  open,
  mode,
  conversation,
  onOpenChange,
  onModeChange,
}: {
  open: boolean
  mode: FormMode
  conversation: Conversation | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
}) {
  const readOnly = mode === "view"
  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel="conversation"
      description="Create or manage a saved AI conversation."
      canEdit={!!conversation}
      onEdit={() => onModeChange("edit")}
      onSubmit={() => onOpenChange(false)}
    >
      <FormField label="Conversation title" required>
        <Input
          name="title"
          defaultValue={conversation?.title}
          disabled={readOnly}
          placeholder="Network troubleshooting"
        />
      </FormField>
      {mode === "create" && (
        <FormField label="First message">
          <Textarea
            name="message"
            rows={5}
            placeholder="Describe what you want Network AI to do..."
          />
        </FormField>
      )}
      <FormField label="Owner">
        <Input
          name="user_id"
          defaultValue={conversation?.user_id ?? "user-011026-0001"}
          disabled={readOnly}
        />
      </FormField>
      {conversation && (
        <div className="rounded-lg border bg-muted/30 p-3 text-[10px] text-muted-foreground">
          <p>
            ID: <span className="font-mono">{conversation.id}</span>
          </p>
          <p className="mt-1">
            Created: {new Date(conversation.created_at).toLocaleString("vi-VN")}
          </p>
          <p className="mt-1">
            Updated:{" "}
            {new Date(conversation.last_updated_at).toLocaleString("vi-VN")}
          </p>
        </div>
      )}
    </FeatureFormSheet>
  )
}
