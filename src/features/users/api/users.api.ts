import { api } from "@/service/api"
import type { User, UserCreate, UserUpdate } from "@/service/contracts"

export const usersApi = {
  list: async () => (await api.get<User[]>("/users/")).data,
  get: async (userId: string) => (await api.get<User>(`/users/${userId}`)).data,
  create: async (payload: UserCreate) => (await api.post<User>("/users/", payload)).data,
  update: async (userId: string, payload: UserUpdate) =>
    (await api.patch<User>(`/users/${userId}`, payload)).data,
}
