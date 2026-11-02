export type ConversationTitleDialogProps = {
  open: boolean
  title: string
  onOpenChange: (open: boolean) => void
  onSave: (title: string) => Promise<void>
}
