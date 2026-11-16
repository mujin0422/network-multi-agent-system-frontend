import { api } from "@/service/api"
import type {
  Conversation,
  ConversationDetail,
  ConversationPage,
  ConversationStarted,
  Message,
  MessageCreate,
  MessagePage,
} from "@/service/contracts"

export const conversationsApi = {
  list: async (params: { userId?: string; limit?: number; cursor?: string } = {}) =>
    (await api.get<ConversationPage>("/conversations/", {
      params: {
        user_id: params.userId,
        limit: params.limit ?? 20,
        cursor: params.cursor,
      },
    })).data,
  get: async (conversationId: string) =>
    (await api.get<ConversationDetail>(`/conversations/${conversationId}`)).data,
  renameTitle: async (conversationId: string, title: string) =>
    (await api.patch<Conversation>(`/conversations/${conversationId}/title`, { title })).data,
  start: async (message: string, benchmarkRunId?: string) =>
    (await api.post<ConversationStarted>("/conversations/messages", {
      message,
      benchmark_run_id: benchmarkRunId,
    })).data,
  listMessages: async (
    conversationId: string,
    params: { limit?: number; cursor?: string } = {},
  ) =>
    (await api.get<MessagePage>(`/conversations/${conversationId}/messages`, {
      params: { limit: params.limit ?? 30, cursor: params.cursor },
    })).data,
  addMessage: async (conversationId: string, payload: MessageCreate) =>
    (await api.post<Message>(`/conversations/${conversationId}/messages`, payload)).data,
}
