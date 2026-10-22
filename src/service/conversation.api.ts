import { api } from "./api"
import type {
  Conversation,
  ConversationDetail,
  ConversationStarted,
  Message,
  MessageCreate,
} from "./contracts"

export const conversationsApi = {
  list: async (userId?: string) =>
    (await api.get<Conversation[]>("/conversations/", { params: { user_id: userId } })).data,
  get: async (conversationId: string) =>
    (await api.get<ConversationDetail>(`/conversations/${conversationId}`)).data,
  start: async (message: string) =>
    (await api.post<ConversationStarted>("/conversations/messages", { message })).data,
  listMessages: async (conversationId: string) =>
    (await api.get<Message[]>(`/conversations/${conversationId}/messages`)).data,
  addMessage: async (conversationId: string, payload: MessageCreate) =>
    (await api.post<Message>(`/conversations/${conversationId}/messages`, payload)).data,
}
