import type { Credential } from "../types/credentials.type"

export function matchesCredential(credential: Credential, query: string) {
  return [credential.id, credential.name, credential.description, credential.username, credential.encryption_type]
    .join(" ")
    .toLowerCase()
    .includes(query.trim().toLowerCase())
}
