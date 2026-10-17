import type { Role } from "../types/role.type"
import type { UserStatus } from "../types/user-status.type"
import type { User } from "../types/user.type"

export function userInitials(fullName: string) {
  return fullName.trim().split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase()
}

export function roleName(roles: readonly Role[], id: string) {
  return roles.find((role) => role.id === id)?.name ?? id
}

export function matchesUser(user: User, query: string, status: UserStatus | "ALL") {
  const matchesQuery = [user.id, user.full_name, user.email, user.user_status].join(" ").toLowerCase().includes(query.trim().toLowerCase())
  return matchesQuery && (status === "ALL" || user.user_status === status)
}
