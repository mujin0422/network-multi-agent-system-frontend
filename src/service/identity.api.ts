import { api } from "./api"
import type { Role, RoleCreate, RoleUpdate, User, UserCreate, UserUpdate } from "./contracts"

export const usersApi = {
  list: async () => (await api.get<User[]>("/users/")).data,
  get: async (userId: string) => (await api.get<User>(`/users/${userId}`)).data,
  create: async (payload: UserCreate) => (await api.post<User>("/users/", payload)).data,
  update: async (userId: string, payload: UserUpdate) =>
    (await api.patch<User>(`/users/${userId}`, payload)).data,
}

export const rolesApi = {
  list: async () => (await api.get<Role[]>("/roles/")).data,
  get: async (roleId: string) => (await api.get<Role>(`/roles/${roleId}`)).data,
  create: async (payload: RoleCreate) => (await api.post<Role>("/roles/", payload)).data,
  update: async (roleId: string, payload: RoleUpdate) =>
    (await api.patch<Role>(`/roles/${roleId}`, payload)).data,
}
