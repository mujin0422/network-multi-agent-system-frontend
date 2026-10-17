import type { Conversation } from "./conversation.type"

export type ConversationSidebarProps = {
  conversations: Conversation[]
  activeConversationId: string
  query: string
  mobileOpen: boolean
  collapsed: boolean
  onQueryChange: (query: string) => void
  onSelect: (conversationId: string) => void
  onCreate: () => void
  onClose: () => void
  onCollapse: () => void
}
