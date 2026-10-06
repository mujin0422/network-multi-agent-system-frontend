export type Role = { id: string; name: string; created_at: string; last_updated_at: string | null }
export type ManagementFunction = { id: string; name: string }
export type Action = { id: string; name: "View" | "Add" | "Edit" | "Delete" | "Execute" | "Approve" }
export type Permission = { id: string; function_id: string; action_id: string }
export type RolePermission = { role_id: string; permission_id: string }
