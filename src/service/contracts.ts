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
export type ManagementFunction = { id: string; name: string; description: string | null }
export type PermissionAction = { id: string; name: string; description: string | null }
export type Permission = { id: string; function_id: string; action_id: string }
export type RolePermission = { role_id: string; permission_id: string }
export type PermissionCatalog = {
  functions: ManagementFunction[]
  actions: PermissionAction[]
  permissions: Permission[]
}

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

export type BenchmarkRunStatus = "PREPARING" | "READY" | "RUNNING" | "COMPLETED" | "FAILED" | "CLEANED"
export type BenchmarkCheck = {
  device: string
  command: string
  assertion: { contains?: string | null; not_contains?: string | null }
}
export type BenchmarkAction = {
  device: string
  action:
    | "interface_shutdown"
    | "interface_no_shutdown"
    | "ospf_network_add"
    | "ospf_network_remove"
    | "mpls_enable"
    | "mpls_disable"
    | "default_route_add"
    | "default_route_remove"
    | "interface_ip_set"
    | "acl_block"
    | "acl_remove"
    | "bgp_neighbor_shutdown"
    | "bgp_neighbor_no_shutdown"
  interface?: string | null
  process_id?: number | null
  network?: string | null
  wildcard?: string | null
  area?: number | null
  next_hop?: string | null
  ip_address?: string | null
  subnet_mask?: string | null
  acl_number?: number | null
  direction?: "in" | "out" | null
  source_network?: string | null
  source_wildcard?: string | null
  local_as?: number | null
  neighbor_ip?: string | null
}
export type BenchmarkRootCause = {
  fault_type: string
  device: string
  interface?: string | null
}
export type BenchmarkScenarioCreate = {
  scenario_key: string
  version: string
  name: string
  description: string
  topology: string
  initial_message: string
  preconditions: BenchmarkCheck[]
  injection: BenchmarkAction[]
  fault_verification: BenchmarkCheck[]
  ground_truth: BenchmarkRootCause[]
  evaluation_required_terms: string[]
  cleanup: BenchmarkAction[]
}
export type BenchmarkScenarioUpdate = Partial<Omit<BenchmarkScenarioCreate, "scenario_key">> & {
  is_active?: boolean
}
export type BenchmarkScenario = {
  id: string
  scenario_key: string
  version: string
  name: string
  description: string
  topology: string
  initial_message: string
  is_active: boolean
  created_at: string | null
  last_updated_at: string | null
}
export type BenchmarkScenarioDetail = BenchmarkScenario & BenchmarkScenarioCreate

export type BenchmarkRun = {
  id: string
  scenario_id: string
  scenario_version: string
  scenario_name: string
  status: BenchmarkRunStatus
  started_by: string
  initial_message: string
  conversation_id: string | null
  source_message_id: string | null
  task_id: string | null
  evaluation_id: string | null
  evaluation_result: "PASS" | "FAIL" | null
  cleanup_required: boolean
  error_message: string | null
  started_at: string
  completed_at: string | null
  cleaned_at: string | null
}

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
  task_type: TaskType
  task_status: TaskStatus
  started_at: string | null
  completed_at: string | null
  created_at: string
}
export type TaskCreate = Pick<Task, "conversation_id" | "source_message_id" | "user_id" | "input_message">
export type TaskDetail = Task & { operations: Operation[] }

export type TaskOperationDevice = {
  id: string
  operation_id: string
  device_id: string
  operation_device_status: OperationStatus
  device_role: "SOURCE" | "TARGET" | "CONTEXT"
  access_mode: "READ" | "WRITE"
  error_message: string | null
  started_at: string | null
  completed_at: string | null
}

export type OperationDependency = {
  id: string
  operation_id: string
  depends_on_operation_id: string
  dependency_type: "ON_SUCCESS" | "ON_COMPLETION"
  created_at: string
}

export type TaskExecution = {
  id: string
  task_id: string
  operation_id: string | null
  operation_device_id: string | null
  agent_name: string
  tool_name: string | null
  step_order: number
  input: unknown
  output: unknown
  execution_status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED"
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  duration_ms: number | null
  created_at: string
}

export type EvaluationStatus = "PENDING" | "COMPLETED" | "ERROR"
export type EvaluationResult = "PASS" | "FAIL" | "UNKNOWN" | "NOT_APPLICABLE"
export type EvaluationMetricType = "GOAL" | "RCA" | "REMEDIATION" | "SAFETY" | "LATENCY" | "INTERACTION_TURNS"
export type TaskEvaluationMetric = {
  id: string
  evaluation_id: string
  metric_type: EvaluationMetricType
  result: EvaluationResult
  is_required: boolean
  was_attempted: boolean | null
  expected_value: unknown
  actual_value: unknown
  evidence: unknown
  created_at: string
}
export type TaskEvaluationSummary = {
  id: string
  task_id: string
  evaluation_status: EvaluationStatus
  evaluator_type: "AUTOMATED" | "HUMAN"
  evaluator_version: string | null
  created_at: string
  evaluated_at: string | null
  results: Partial<Record<EvaluationMetricType, EvaluationResult>>
  measurements?: Partial<Record<EvaluationMetricType, number>>
}
export type TaskEvaluationDetail = {
  id: string
  task_id: string
  evaluation_status: EvaluationStatus
  evaluator_type: "AUTOMATED" | "HUMAN"
  evaluator_version: string | null
  created_at: string
  evaluated_at: string | null
  metrics: TaskEvaluationMetric[]
}

export type TaskRecords = {
  task: TaskDetail
  operation_devices: TaskOperationDevice[]
  dependencies: OperationDependency[]
  executions: TaskExecution[]
  activity_events: TaskActivityEvent[]
  approvals: OperationDeviceApproval[]
}

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

export type DeviceActionLog = {
  id: string
  task_id: string
  operation_id: string
  operation_device_id: string
  execution_id: string
  device_id: string
  rollback_of_action_id: string | null
  action_type: "READ" | "WRITE"
  action_phase: "READ" | "PRE_CHECK" | "APPLY" | "POST_CHECK" | "ROLLBACK" | "ROLLBACK_VERIFY"
  sequence_number: number
  command: string
  result: string | null
  action_log_status: "SUCCESS" | "FAILED" | "UNKNOWN"
  error_message: string | null
  executed_at: string
}

export type AuditActorType = "USER" | "SYSTEM" | "AGENT"
export type AuditEventStatus = "SUCCESS" | "FAILED" | "DENIED"

export type AuditLog = {
  id: string
  actor_user_id: string | null
  actor_display_name: string | null
  actor_type: AuditActorType
  action: string
  resource_type: string
  resource_id: string | null
  event_status: AuditEventStatus
  summary: string | null
  event_data: Record<string, unknown>
  request_id: string | null
  source_ip: string | null
  user_agent: string | null
  occurred_at: string
}
