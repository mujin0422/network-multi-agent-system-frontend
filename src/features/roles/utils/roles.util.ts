import type { Permission } from "../types/permission.type"

export function findPermission(permissions: readonly Permission[], functionId: string, actionId: string) {
  return permissions.find((permission) => permission.function_id === functionId && permission.action_id === actionId)
}
