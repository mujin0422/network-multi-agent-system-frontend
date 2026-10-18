import type { ProfileUser } from "../types/profile-user.type"

export const PROFILE_COPY = {
  title: "My Profile",
  description: "Manage your personal information and account details.",
} as const

export const PROFILE_STATUS_LABELS: Record<
  ProfileUser["user_status"],
  string
> = {
  ACTIVE: "Active",
  DISABLED: "Disabled",
}
