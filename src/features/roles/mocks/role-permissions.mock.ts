import type { RolePermission } from "../types/role-permission.type"

const PERMISSION_REFERENCES = Array.from({ length: 48 }, (_, index) => ({
  id: `perm-${String(index + 1).padStart(4, "0")}`,
  function_id: `func-${String(Math.floor(index / 6) + 1).padStart(4, "0")}`,
  action_id: `acts-${String(index % 6 + 1).padStart(4, "0")}`,
}))

export const MOCK_ROLE_PERMISSIONS: RolePermission[] = PERMISSION_REFERENCES.flatMap((permission) => [
  { role_id: "role-0001", permission_id: permission.id },
  ...(["func-0001", "func-0002", "func-0003", "func-0004", "func-0005"].includes(permission.function_id) && permission.action_id !== "acts-0004" ? [{ role_id: "role-0002", permission_id: permission.id }] : []),
  ...(["func-0001", "func-0002", "func-0003", "func-0004"].includes(permission.function_id) && ["acts-0001", "acts-0005"].includes(permission.action_id) ? [{ role_id: "role-0003", permission_id: permission.id }] : []),
  ...(["func-0001", "func-0006"].includes(permission.function_id) && permission.action_id === "acts-0001" ? [{ role_id: "role-0004", permission_id: permission.id }] : []),
])
