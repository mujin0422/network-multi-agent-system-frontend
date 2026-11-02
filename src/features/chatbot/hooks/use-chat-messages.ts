import { useCallback, useEffect, useRef, useState } from "react"
import { approvalsApi, authApi, conversationsApi, devicesApi, tasksApi } from "@/service"
import type { TaskActivityEvent } from "@/service"
import type { ChatMessage } from "../types/chat-message.type"
import type { ChatTaskPreview } from "../types/chat-task-preview.type"
import type { Conversation } from "../types/conversation.type"

const DRAFT_ID = "new-conversation"
const POLL_INTERVAL_MS = 1500
const MAX_POLL_ATTEMPTS = 400
const MAX_CONSECUTIVE_POLL_FAILURES = 6
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

type ChatOptions = { benchmarkRunId?: string; initialPrompt?: string }

export function useChatMessages(options: ChatOptions = {}) {
  const { benchmarkRunId, initialPrompt } = options
  const [input, setInput] = useState(initialPrompt ?? "")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [taskPreviews, setTaskPreviews] = useState<ChatTaskPreview[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([draftConversation()])
  const [activeConversationId, setActiveConversationIdState] = useState(DRAFT_ID)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pollingGeneration = useRef(0)
  const deviceNames = useRef<Map<string, string> | null>(null)
  const benchmarkStarted = useRef(false)

  const loadTaskPreviews = useCallback(async (conversationMessages: ChatMessage[]) => {
    const [allTasks, names] = await Promise.all([
      tasksApi.list(),
      deviceNames.current
        ? Promise.resolve(deviceNames.current)
        : devicesApi.list({ page_size: 100 })
            .then((page) => new Map(page.items.map((device) => [device.id, device.hostname])))
            .catch(() => new Map<string, string>()),
    ])
    deviceNames.current = names
    const messageIds = new Set(conversationMessages.map((message) => message.id))
    const relevantTasks = allTasks.filter((task) => messageIds.has(task.source_message_id))
    const previews = await Promise.all(relevantTasks.map(async (task): Promise<ChatTaskPreview> => {
      const [detail, events] = await Promise.all([tasksApi.get(task.id), tasksApi.listActivityEvents(task.id)])
      // Chỉ tải approvals của các operation đã yêu cầu phê duyệt; không tạo
      // request cho tất cả operations trong mỗi vòng polling.
      const approvalOperationIds = new Set(
        events
          .filter((event) => event.event_type === "APPROVAL_REQUESTED" && event.operation_id)
          .map((event) => event.operation_id),
      )
      const approvalOperations = detail.operations.filter(
        (operation) =>
          operation.operation_status === "WAITING_APPROVAL" ||
          approvalOperationIds.has(operation.id),
      )
      // Một endpoint lỗi không được làm mất timeline hoặc approval khác.
      const approvalResponses = await Promise.allSettled(
        approvalOperations.map(async (operation) =>
          (await approvalsApi.listByOperation(operation.id)).map((approval) => ({
            approval,
            operationId: operation.id,
          })),
        ),
      )
      const approvalEntries = approvalResponses.flatMap((response) =>
        response.status === "fulfilled" ? response.value : [],
      )
      const approvalFetchFailed = approvalResponses.some(
        (response) => response.status === "rejected",
      )
      const responses = conversationMessages.filter(
        (message) =>
          message.sender_by === "AGENT" &&
          message.reply_to_message_id === task.source_message_id,
      )
      const approvalResponse = responses.find(
        (message) => message.message_type === "APPROVAL_REQUEST",
      )
      const finalResponse = responses.find(
        (message) => message.message_type === "FINAL_RESPONSE",
      )
      // Giữ workflow và thẻ phê duyệt tại đúng vị trí của approval message.
      // Nếu task không cần phê duyệt, workflow được đặt cạnh final response.
      const response = approvalResponse ?? finalResponse ?? responses[0]
      const activeDuration = events.reduce((total, event) => {
        if (!event.started_at || !event.completed_at) return total
        return total + Math.max(0, Date.parse(event.completed_at) - Date.parse(event.started_at))
      }, 0)
      const approvalEntry = approvalEntries.find((item) => item.approval.approval_status === "PENDING") ?? approvalEntries[0]
      const approval = approvalEntry?.approval
      const approvalDevices = approval
        ? [...names.entries()].filter(([deviceId]) => approval.reason.includes(deviceId))
        : []
      const approvalDescription = approvalDevices.reduce(
        (description, [deviceId, hostname]) => description.replaceAll(deviceId, hostname),
        approval?.reason ?? "",
      )
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
          description: approvalDescription,
          risk_level: approval.risk_level,
          devices: approvalDevices.length
            ? approvalDevices.map(([, hostname]) => hostname)
            : [approval.operation_device_id],
          commands: approval.commands_snapshot,
          status: approval.approval_status,
        } : undefined,
        approvalLoadError:
          task.task_status === "RUNNING" &&
          (approvalResponse || approvalOperationIds.size > 0) &&
          !approval
            ? approvalFetchFailed
              ? "Không thể tải phiếu phê duyệt. Hãy thử tải lại hội thoại, không gửi yêu cầu cấu hình lần nữa."
              : "Phiếu phê duyệt chưa sẵn sàng. Bạn có thể tải lại hội thoại."
            : undefined,
      }
    }))
    setTaskPreviews(previews)
    return previews
  }, [])

  const loadConversation = useCallback(async (
    conversationId: string,
    showSkeleton = false,
    silentFailure = false,
  ) => {
    if (showSkeleton) setLoadingMessages(true)
    try {
      const rows = await conversationsApi.listMessages(conversationId)
      setMessages(rows)
      const previews = await loadTaskPreviews(rows)
      return { rows, previews }
    } catch (reason) {
      // Polling xử lý retry riêng; giữ lại timeline đang hiển thị khi mất mạng.
      if (!silentFailure) {
        setError(reason instanceof Error ? reason.message : "Không thể tải hội thoại")
      }
      return undefined
    } finally {
      if (showSkeleton) setLoadingMessages(false)
    }
  }, [loadTaskPreviews])

  const reloadConversations = useCallback(async () => {
    try {
      const me = await authApi.me()
      const rows = await conversationsApi.list(me.id)
      const shouldKeepBenchmarkDraft = Boolean(benchmarkRunId) && !benchmarkStarted.current
      const visibleRows = shouldKeepBenchmarkDraft ? [draftConversation(), ...rows] : rows.length ? rows : [draftConversation()]
      setConversations(visibleRows)
      setActiveConversationIdState((current) => {
        if (shouldKeepBenchmarkDraft) return DRAFT_ID
        return current !== DRAFT_ID && rows.some((row) => row.id === current) ? current : rows[0]?.id ?? DRAFT_ID
      })
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải danh sách hội thoại") }
    finally { setLoadingConversations(false) }
  }, [benchmarkRunId])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reloadConversations() }, [reloadConversations])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ message khi đổi conversation.
    if (activeConversationId !== DRAFT_ID) void loadConversation(activeConversationId, true)
  }, [activeConversationId, loadConversation])

  function createNewConversation() {
    pollingGeneration.current += 1
    if (!conversations.some((conversation) => conversation.id === DRAFT_ID)) setConversations((current) => [draftConversation(), ...current])
    setActiveConversationIdState(DRAFT_ID); setMessages([]); setTaskPreviews([]); setLoadingMessages(false); setInput(""); setError(null)
  }
  function setActiveConversationId(id: string) {
    pollingGeneration.current += 1
    setActiveConversationIdState(id)
  }

  async function renameConversation(conversationId: string, title: string) {
    setError(null)
    try {
      const updated = await conversationsApi.renameTitle(conversationId, title)
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === updated.id ? updated : conversation,
        ),
      )
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Không thể đổi tiêu đề hội thoại"
      setError(message)
      throw reason instanceof Error ? reason : new Error(message)
    }
  }

  const pollWorkflow = useCallback(async (
    conversationId: string,
    sourceMessageId: string,
    generation: number,
  ) => {
    let consecutiveFailures = 0
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      if (pollingGeneration.current !== generation) return
      const snapshot = await loadConversation(conversationId, false, true)
      if (pollingGeneration.current !== generation) return

      if (!snapshot) {
        consecutiveFailures += 1
        if (consecutiveFailures >= MAX_CONSECUTIVE_POLL_FAILURES) {
          setError("Mất kết nối khi cập nhật tiến trình. Hãy tải lại hội thoại, không gửi yêu cầu cấu hình lần nữa.")
          return
        }
        await wait(Math.min(POLL_INTERVAL_MS * 2 ** consecutiveFailures, 8000))
        continue
      }
      consecutiveFailures = 0
      setError(null)

      const finalResponse = snapshot.rows.some(
        (message) =>
          message.sender_by === "AGENT" &&
          message.reply_to_message_id === sourceMessageId &&
          message.message_type === "FINAL_RESPONSE",
      )
      const preview = snapshot.previews.find(
        (item) => item.source_message_id === sourceMessageId,
      )
      // APPROVAL_REQUESTED là sự kiện lịch sử nên vẫn mang WAITING_APPROVAL
      // sau khi người dùng đã quyết định. Chỉ dừng polling theo trạng thái
      // approval hiện tại để workflow có thể tiếp tục ngay sau phê duyệt.
      const waitingApproval = preview?.approval?.status === "PENDING"
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
        const started = await conversationsApi.start(content, benchmarkRunId)
        benchmarkStarted.current = true
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

  async function retryConversation() {
    setError(null)
    if (activeConversationId === DRAFT_ID) {
      await reloadConversations()
      return
    }

    // Tải lại dữ liệu đã lưu, không POST thêm message/configuration request.
    const generation = pollingGeneration.current + 1
    pollingGeneration.current = generation
    const snapshot = await loadConversation(activeConversationId, true)
    if (!snapshot) return

    const lastUserMessage = [...snapshot.rows]
      .filter((message) => message.sender_by === "USER")
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0]
    if (!lastUserMessage) return
    const preview = snapshot.previews.find(
      (task) => task.source_message_id === lastUserMessage.id,
    )
    const completed = preview && ["SUCCESS", "PARTIAL_SUCCESS", "FAILED", "REJECTED"].includes(preview.task_status)
    if (!completed && preview?.approval?.status !== "PENDING") {
      void pollWorkflow(activeConversationId, lastUserMessage.id, generation)
    }
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
      throw reason
    } finally {
      setSending(false)
    }
  }, [activeConversationId, loadConversation, pollWorkflow, taskPreviews])

  return { input, messages, taskPreviews, conversations, activeConversationId, sending, loadingConversations, loadingMessages, error, createNewConversation, renameConversation, sendMessage, decideApproval, retryConversation, setActiveConversationId, setInput }
}
