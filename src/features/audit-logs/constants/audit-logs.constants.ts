import type { AuditActorType, AuditEventStatus } from "@/service/contracts"

export const AUDIT_STATUS_LABELS: Record<AuditEventStatus, string> = {
  SUCCESS: "Success",
  FAILED: "Failed",
  DENIED: "Denied",
}

export const AUDIT_ACTOR_TYPE_LABELS: Record<AuditActorType, string> = {
  USER: "User",
  SYSTEM: "System",
  AGENT: "Agent",
}

export const AUDIT_STATUS_OPTIONS = (
  Object.keys(AUDIT_STATUS_LABELS) as AuditEventStatus[]
).map((status) => ({
  value: status,
  label: AUDIT_STATUS_LABELS[status],
}))

export const AUDIT_ACTOR_TYPE_OPTIONS = (
  Object.keys(AUDIT_ACTOR_TYPE_LABELS) as AuditActorType[]
).map((actorType) => ({
  value: actorType,
  label: AUDIT_ACTOR_TYPE_LABELS[actorType],
}))
