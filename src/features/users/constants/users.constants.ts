import type { UserStatus } from "../types/user-status.type"

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  DISABLED: "Disabled",
}

export const USER_STATUS_OPTIONS = (
  Object.keys(USER_STATUS_LABELS) as UserStatus[]
).map((status) => ({
  value: status,
  label: USER_STATUS_LABELS[status],
}))
