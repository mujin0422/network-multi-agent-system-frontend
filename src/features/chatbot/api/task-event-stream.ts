import { authApi } from "@/features/auth/api/auth.api"
import { API_BASE_URL } from "@/service/api"
import type { TaskStreamEvent } from "@/service/contracts"
import { getAccessToken } from "@/service/token-storage"

type StreamTaskEventsOptions = {
  sourceMessageId: string
  afterSequence?: number
  signal: AbortSignal
  onEvent: (event: TaskStreamEvent) => void | boolean
}

/** Đọc một kết nối SSE bằng fetch để gửi được Bearer token. */
export async function streamTaskEvents({
  sourceMessageId,
  afterSequence = 0,
  signal,
  onEvent,
}: StreamTaskEventsOptions): Promise<void> {
  const open = async (allowRefresh: boolean): Promise<Response> => {
    const token = getAccessToken()
    const response = await fetch(
      `${API_BASE_URL}/tasks/by-source-message/${encodeURIComponent(sourceMessageId)}/events/stream?after_sequence=${afterSequence}`,
      {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(afterSequence > 0 ? { "Last-Event-ID": String(afterSequence) } : {}),
        },
        cache: "no-store",
        signal,
      },
    )
    if (response.status === 401 && allowRefresh) {
      await authApi.refresh()
      return open(false)
    }
    if (!response.ok) {
      throw new Error(`SSE không thể kết nối (HTTP ${response.status})`)
    }
    if (!response.body) throw new Error("SSE response không có stream body")
    return response
  }

  const response = await open(true)
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read()
      buffer += decoder.decode(value, { stream: !done }).replaceAll("\r\n", "\n")
      let boundary = buffer.indexOf("\n\n")
      while (boundary >= 0) {
        const block = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        boundary = buffer.indexOf("\n\n")
        if (!block || block.startsWith(":")) continue

        const eventName = block
          .split("\n")
          .find((line) => line.startsWith("event:"))
          ?.slice(6)
          .trim()
        if (eventName !== "task_activity") continue
        const data = block
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trimStart())
          .join("\n")
        if (!data) continue
        const keepStreaming = onEvent(JSON.parse(data) as TaskStreamEvent)
        if (keepStreaming === false) {
          await reader.cancel()
          return
        }
      }
      if (done) return
    }
  } finally {
    reader.releaseLock()
  }
}
