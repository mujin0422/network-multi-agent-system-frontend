export type UserStatus = "ACTIVE" | "DISABLED"

export type User = {
  id: string
  role_id: string
  email: string
  full_name: string
  user_status: UserStatus
  created_at: string
  last_updated_at: string | null
  last_login_at: string | null
}

export type UserCreate = Pick<User, "role_id" | "email" | "full_name"> & {
  password: string
  user_status?: UserStatus
}
export type UserUpdate = Partial<UserCreate>
export type LoginRequest = { email: string; password: string }
export type TokenResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export type Role = {
  id: string
  name: string
  description: string | null
  created_by: string | null
  last_updated_by: string | null
  created_at: string
  last_updated_at: string | null
}
export type RoleCreate = { name: string; description?: string | null }
export type RoleUpdate = Partial<RoleCreate>

export type Brand = { id: string; name: string; supported_drivers: string[] }
export type BrandCreate = { name: string; supported_drivers?: string[] }
export type BrandUpdate = Partial<BrandCreate>
export type Category = { id: string; name: string }

export type Credential = {
  id: string
  name: string
  description: string | null
  username: string
  encryption_type: string
  created_by: string
  last_updated_by: string | null
  created_at: string
  last_updated_at: string
}
export type CredentialCreate = {
  name: string
  description?: string | null
  username: string
  password: string
  secret?: string | null
  encryption_type?: "PGP_SYM_AES256"
}
export type CredentialUpdate = Partial<CredentialCreate>

export type Device = {
  id: string
  credential_id: string | null
  brand_id: string
  category_id: string
  hostname: string
  host: string
  port: number
  device_type: string
  location: string | null
  created_by: string
  last_updated_by: string | null
  created_at: string
  last_updated_at: string
}
export type DeviceCreate = {
  credential_id?: string | null
  brand_id: string
  category_id: string
  hostname: string
  host?: string
  port: number
  device_type?: string
  location?: string | null
  last_updated_by: string
}
export type DeviceUpdate = Partial<Omit<DeviceCreate, "last_updated_by">> & {
  last_updated_by: string
}
export type DevicePage = {
  items: Device[]
  page: number
  page_size: number
  total: number
  total_pages: number
}
export type DeviceListParams = {
  page?: number
  page_size?: number
  brand_id?: string
  category_id?: string
}

export type MessageSender = "USER" | "AGENT"
export type MessageType = "GENERAL" | "USER_REQUEST" | "STATUS_UPDATE" | "APPROVAL_REQUEST" | "FINAL_RESPONSE"
export type Message = {
  id: string
  conversation_id: string
  reply_to_message_id: string | null
  sender_by: MessageSender
  message_type: MessageType
  message: string
  created_at: string
}
export type MessageCreate = {
  sender_by: MessageSender
  reply_to_message_id?: string | null
  message_type?: MessageType | null
  message: string
}
export type Conversation = {
  id: string
  user_id: string
  title: string
  created_at: string
  last_updated_at: string
}
export type ConversationDetail = Conversation & { messages: Message[] }
export type ConversationStarted = { conversation: Conversation; message: Message }

export type TaskStatus = "PENDING" | "PLANNING" | "RUNNING" | "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED" | "REJECTED"
export type TaskType = "UNCLASSIFIED" | "INFORMATION_RETRIEVAL" | "DIAGNOSIS" | "CONFIGURATION" | "REMEDIATION" | "COMPOSITE"
export type OperationStatus = "PENDING" | "WAITING_APPROVAL" | "RUNNING" | "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED" | "REJECTED" | "SKIPPED"
export type Operation = {
  id: string
  task_id: string
  operation_intent: string
  display_order: number
  operation_status: OperationStatus
  operation_parameters: Record<string, unknown>
  created_at: string
  started_at: string | null
  completed_at: string | null
}
export type OperationCreate = Pick<Operation, "operation_intent" | "display_order"> & {
  operation_parameters?: Record<string, unknown>
}
export type Task = {
  id: string
  conversation_id: string
  source_message_id: string
  user_id: string
  input_message: string
  task_status: TaskStatus
  task_type: TaskType
  started_at: string | null
  completed_at: string | null
  created_at: string
}
export type TaskCreate = Pick<Task, "conversation_id" | "source_message_id" | "user_id" | "input_message">
export type TaskDetail = Task & { operations: Operation[] }

export type ActivityActorType = "ORCHESTRATOR" | "PLANNER" | "NETWORK" | "ANALYST" | "TOOL"
export type ActivityEventStatus = "PENDING" | "RUNNING" | "WAITING_APPROVAL" | "SUCCESS" | "FAILED" | "SKIPPED"
export type ActivityEventType =
  | "MESSAGE_RECEIVED"
  | "TASK_CREATED"
  | "PLAN_GENERATED"
  | "OPERATIONS_CREATED"
  | "DEPENDENCIES_CREATED"
  | "DEVICES_ASSIGNED"
  | "EXECUTION_STARTED"
  | "COMMAND_EXECUTED"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_APPROVED"
  | "APPROVAL_REJECTED"
  | "ANALYSIS_STARTED"
  | "ANALYSIS_COMPLETED"
  | "FINAL_RESPONSE_CREATED"
  | "TASK_COMPLETED"
  | "TASK_FAILED"
export type TaskActivityEvent = {
  id: string
  task_id: string
  operation_id: string | null
  execution_id: string | null
  actor_type: ActivityActorType
  event_type: ActivityEventType
  event_status: ActivityEventStatus
  sequence_number: number
  event_data: Record<string, unknown>
  started_at: string | null
  completed_at: string | null
  created_at: string
}

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED"
export type ApprovalDecision = "APPROVED" | "REJECTED"
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type OperationDeviceApproval = {
  id: string
  operation_device_id: string
  approval_status: ApprovalStatus
  risk_level: RiskLevel
  requested_by: string
  reason: string
  commands_snapshot: string[]
  decided_by: string | null
  requested_at: string
  decided_at: string | null
  expires_at: string | null
  created_at: string
}
