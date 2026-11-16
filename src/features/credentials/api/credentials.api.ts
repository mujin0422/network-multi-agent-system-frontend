import { api } from "@/service/api"
import type { Credential, CredentialCreate, CredentialUpdate } from "@/service/contracts"

export const credentialsApi = {
  list: async () => (await api.get<Credential[]>("/credentials/")).data,
  get: async (credentialId: string) =>
    (await api.get<Credential>(`/credentials/${credentialId}`)).data,
  create: async (payload: CredentialCreate) =>
    (await api.post<Credential>("/credentials/", payload)).data,
  update: async (credentialId: string, payload: CredentialUpdate) =>
    (await api.patch<Credential>(`/credentials/${credentialId}`, payload)).data,
}
