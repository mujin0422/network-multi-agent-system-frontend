import { api } from "@/service/api"
import type {
  PermissionCatalog,
  Role,
  RoleCreate,
  RolePermission,
  RoleUpdate,
} from "@/service/contracts"

export const rolesApi = {
  list: async () => (await api.get<Role[]>("/roles/")).data,
  get: async (roleId: string) => (await api.get<Role>(`/roles/${roleId}`)).data,
  create: async (payload: RoleCreate) => (await api.post<Role>("/roles/", payload)).data,
  update: async (roleId: string, payload: RoleUpdate) =>
    (await api.patch<Role>(`/roles/${roleId}`, payload)).data,
}

export const accessControlApi = {
  getCatalog: async () =>
    (await api.get<PermissionCatalog>("/roles/permission-catalog")).data,
  listRolePermissions: async (roleId: string) =>
    (await api.get<RolePermission[]>(`/roles/${roleId}/permissions`)).data,
  replaceRolePermissions: async (roleId: string, permissionIds: string[]) =>
    (
      await api.put<RolePermission[]>(`/roles/${roleId}/permissions`, {
        permission_ids: permissionIds,
      })
    ).data,
}
