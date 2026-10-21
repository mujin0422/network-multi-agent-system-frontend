export type ChatTaskStatus =
  | "PENDING"
  | "PLANNING"
  | "RUNNING"
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "FAILED"
  | "REJECTED"

export type AgentActivityStatus =
  | "PENDING"
  | "RUNNING"
  | "WAITING_APPROVAL"
  | "SUCCESS"
  | "FAILED"
  | "SKIPPED"

export type AgentActivity = {
  id: string
  actor: "ORCHESTRATOR" | "PLANNER" | "NETWORK" | "ANALYST"
  title: string
  detail?: string
  status: AgentActivityStatus
  started_at?: string
  completed_at?: string
}

export type ApprovalRequest = {
  id: string
  operation_id: string
  title: string
  description: string
  risk_level: "LOW" | "MEDIUM" | "HIGH"
  devices: string[]
  commands: string[]
  status: "PENDING" | "APPROVED" | "REJECTED"
}

/** View model của toàn bộ workflow sinh ra từ một USER message. */
export type ChatTaskPreview = {
  /** USER message đã kích hoạt workflow, khớp tasks.source_message_id. */
  source_message_id: string
  /** AGENT message dùng để đặt workflow cạnh câu trả lời trong giao diện chat. */
  response_message_id: string
  task_id: string
  task_status: ChatTaskStatus
  started_at: string
  completed_at?: string
  /** Tổng thời gian agent thực sự chạy, không gồm thời gian chờ phê duyệt. */
  active_duration_ms: number
  activities: AgentActivity[]
  approval?: ApprovalRequest
}
