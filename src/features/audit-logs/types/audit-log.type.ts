import type {
  AuditActorType,
  AuditEventStatus,
} from "@/service/contracts"

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
