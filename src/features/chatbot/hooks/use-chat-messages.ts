import { useCallback, useEffect, useRef, useState } from "react"
import { approvalsApi, authApi, conversationsApi, tasksApi } from "@/service"
import type { TaskActivityEvent } from "@/service"
import type { ChatMessage } from "../types/chat-message.type"
import type { ChatTaskPreview } from "../types/chat-task-preview.type"
import type { Conversation } from "../types/conversation.type"

const DRAFT_ID = "new-conversation"
const POLL_INTERVAL_MS = 750
const MAX_POLL_ATTEMPTS = 800
const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration))
const draftConversation = (): Conversation => ({
  id: DRAFT_ID, user_id: "", title: "New conversation",
  created_at: new Date().toISOString(), last_updated_at: new Date().toISOString(),
})

const activityTitle: Record<TaskActivityEvent["event_type"], string> = {
  MESSAGE_RECEIVED: "Tiếp nhận yêu cầu người dùng",
  TASK_CREATED: "Tạo task xử lý yêu cầu",
  PLAN_GENERATED: "Tạo kế hoạch thực thi",
  OPERATIONS_CREATED: "Tạo các operation",
  DEPENDENCIES_CREATED: "Xác định quan hệ phụ thuộc",
  DEVICES_ASSIGNED: "Gán thiết bị cho operation",
  EXECUTION_STARTED: "Bắt đầu thực thi",
  COMMAND_EXECUTED: "Thực thi lệnh trên thiết bị",
  APPROVAL_REQUESTED: "Yêu cầu người dùng phê duyệt",
  APPROVAL_APPROVED: "Người dùng đã phê duyệt",
  APPROVAL_REJECTED: "Người dùng đã từ chối",
  ANALYSIS_STARTED: "Bắt đầu phân tích kết quả",
  ANALYSIS_COMPLETED: "Hoàn tất phân tích",
  FINAL_RESPONSE_CREATED: "Tạo phản hồi cuối cùng",
  TASK_COMPLETED: "Hoàn tất task",
  TASK_FAILED: "Task thất bại",
}

export function useChatMessages() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [taskPreviews, setTaskPreviews] = useState<ChatTaskPreview[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([draftConversation()])
  const [activeConversationId, setActiveConversationIdState] = useState(DRAFT_ID)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pollingGeneration = useRef(0)

  const loadTaskPreviews = useCallback(async (conversationMessages: ChatMessage[]) => {
    const allTasks = await tasksApi.list()
    const messageIds = new Set(conversationMessages.map((message) => message.id))
    const relevantTasks = allTasks.filter((task) => messageIds.has(task.source_message_id))
    const previews = await Promise.all(relevantTasks.map(async (task): Promise<ChatTaskPreview> => {
      const [detail, events] = await Promise.all([tasksApi.get(task.id), tasksApi.listActivityEvents(task.id)])
      const approvalEntries = (await Promise.all(detail.operations.map(async (operation) =>
        (await approvalsApi.listByOperation(operation.id)).map((approval) => ({ approval, operationId: operation.id })),
      ))).flat()
      const responses = conversationMessages.filter(
        (message) =>
          message.sender_by === "AGENT" &&
          message.reply_to_message_id === task.source_message_id,
      )
      const response = responses.find(
        (message) => message.message_type === "FINAL_RESPONSE",
      ) ?? responses[0]
      const activeDuration = events.reduce((total, event) => {
        if (!event.started_at || !event.completed_at) return total
        return total + Math.max(0, Date.parse(event.completed_at) - Date.parse(event.started_at))
      }, 0)
      const approvalEntry = approvalEntries.find((item) => item.approval.approval_status === "PENDING") ?? approvalEntries[0]
      const approval = approvalEntry?.approval
      return {
        source_message_id: task.source_message_id,
        response_message_id: response?.id ?? "",
        task_id: task.id,
        task_status: task.task_status,
        started_at: task.started_at ?? task.created_at,
        completed_at: task.completed_at ?? undefined,
        active_duration_ms: activeDuration,
        activities: events.map((event) => ({
          id: event.id,
          actor: event.actor_type === "TOOL" ? "NETWORK" : event.actor_type,
          title: activityTitle[event.event_type],
          detail:
            typeof event.event_data.detail === "string"
              ? event.event_data.detail
              : typeof event.event_data.error === "string"
                ? event.event_data.error
                : undefined,
          status: event.event_status,
          started_at: event.started_at ?? undefined,
          completed_at: event.completed_at ?? undefined,
        })),
        approval: approval ? {
          id: approval.id,
          operation_id: approvalEntry.operationId,
          title: "Phê duyệt thay đổi cấu hình",
          description: approval.reason,
          risk_level: approval.risk_level,
          devices: [approval.operation_device_id],
          commands: approval.commands_snapshot,
          status: approval.approval_status,
        } : undefined,
      }
    }))
    setTaskPreviews(previews)
    return previews
  }, [])

  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      const rows = await conversationsApi.listMessages(conversationId)
      setMessages(rows)
      const previews = await loadTaskPreviews(rows)
      return { rows, previews }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải hội thoại") }
  }, [loadTaskPreviews])

  const reloadConversations = useCallback(async () => {
    try {
      const me = await authApi.me()
      const rows = await conversationsApi.list(me.id)
      setConversations(rows.length ? rows : [draftConversation()])
      setActiveConversationIdState((current) => current !== DRAFT_ID && rows.some((row) => row.id === current) ? current : rows[0]?.id ?? DRAFT_ID)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải danh sách hội thoại") }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reloadConversations() }, [reloadConversations])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ message khi đổi conversation.
    if (activeConversationId !== DRAFT_ID) void loadConversation(activeConversationId)
  }, [activeConversationId, loadConversation])

  function createNewConversation() {
    pollingGeneration.current += 1
    if (!conversations.some((conversation) => conversation.id === DRAFT_ID)) setConversations((current) => [draftConversation(), ...current])
    setActiveConversationIdState(DRAFT_ID); setMessages([]); setTaskPreviews([]); setInput(""); setError(null)
  }
  function setActiveConversationId(id: string) {
    pollingGeneration.current += 1
    setActiveConversationIdState(id)
  }

  const pollWorkflow = useCallback(async (
    conversationId: string,
    sourceMessageId: string,
    generation: number,
  ) => {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      if (pollingGeneration.current !== generation) return
      const snapshot = await loadConversation(conversationId)
      if (!snapshot) return

      const finalResponse = snapshot.rows.some(
        (message) =>
          message.sender_by === "AGENT" &&
          message.reply_to_message_id === sourceMessageId &&
          message.message_type === "FINAL_RESPONSE",
      )
      const preview = snapshot.previews.find(
        (item) => item.source_message_id === sourceMessageId,
      )
      const waitingApproval = preview?.activities.some(
        (activity) => activity.status === "WAITING_APPROVAL",
      )
      const analysisFailed = preview?.activities.some(
        (activity) =>
          activity.title === activityTitle.ANALYSIS_COMPLETED &&
          activity.status === "FAILED",
      )
      const taskFailed = preview?.activities.some(
        (activity) => activity.title === activityTitle.TASK_FAILED && activity.status === "FAILED",
      )
      if (finalResponse || waitingApproval || analysisFailed || taskFailed) return
      await wait(POLL_INTERVAL_MS)
    }
    setError("Quá thời gian chờ phản hồi từ AI")
  }, [loadConversation])

  async function sendMessage() {
    const content = input.trim()
    if (!content || sending) return
    setSending(true); setError(null); setInput("")
    const generation = pollingGeneration.current + 1
    pollingGeneration.current = generation
    try {
      let conversationId = activeConversationId
      let sourceMessage: ChatMessage
      if (conversationId === DRAFT_ID) {
        const started = await conversationsApi.start(content)
        conversationId = started.conversation.id
        sourceMessage = started.message
        setActiveConversationIdState(conversationId)
        setMessages([started.message])
      } else {
        sourceMessage = await conversationsApi.addMessage(conversationId, { sender_by: "USER", message_type: "USER_REQUEST", message: content })
        setMessages((current) => [...current, sourceMessage])
      }
      await reloadConversations()
      setActiveConversationIdState(conversationId)
      await pollWorkflow(conversationId, sourceMessage.id, generation)
    } catch (reason) {
      setInput(content)
      setError(reason instanceof Error ? reason.message : "Không thể gửi tin nhắn")
    } finally { setSending(false) }
  }

  const decideApproval = useCallback(async (approvalId: string, decision: "APPROVED" | "REJECTED") => {
    setSending(true)
    setError(null)
    const preview = taskPreviews.find((item) => item.approval?.id === approvalId)
    const generation = pollingGeneration.current + 1
    pollingGeneration.current = generation
    try {
      await approvalsApi.decide(approvalId, decision)
      if (preview) await pollWorkflow(activeConversationId, preview.source_message_id, generation)
      else await loadConversation(activeConversationId)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể xử lý phê duyệt")
    } finally {
      setSending(false)
    }
  }, [activeConversationId, loadConversation, pollWorkflow, taskPreviews])

  return { input, messages, taskPreviews, conversations, activeConversationId, sending, error, createNewConversation, sendMessage, decideApproval, setActiveConversationId, setInput }
}
