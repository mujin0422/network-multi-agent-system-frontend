import type { Credential } from "../types"
export const MOCK_CREDENTIALS: Credential[] = [
  { id: "cred-011026-0001", username: "netops-admin", password: "enc:v1:8fa2••••••", secret: "enc:v1:c410••••••", encryption_type: "AES-256-GCM", created_at: "2026-10-01T07:30:00+07:00", last_updated_at: "2026-10-03T08:20:00+07:00", device_count: 2 },
  { id: "cred-011026-0002", username: "junos-automation", password: "enc:v1:11bf••••••", secret: null, encryption_type: "AES-256-GCM", created_at: "2026-10-01T07:35:00+07:00", last_updated_at: "2026-10-01T07:35:00+07:00", device_count: 1 },
  { id: "cred-011026-0003", username: "forti-api", password: "enc:v1:a23c••••••", secret: "enc:v1:9aa0••••••", encryption_type: "AES-256-GCM", created_at: "2026-10-01T07:40:00+07:00", last_updated_at: "2026-10-02T16:10:00+07:00", device_count: 1 },
  { id: "cred-021026-0004", username: "lab-operator", password: "enc:v1:fe90••••••", secret: null, encryption_type: "AES-256-GCM", created_at: "2026-10-02T13:20:00+07:00", last_updated_at: "2026-10-02T13:20:00+07:00", device_count: 0 },
]

MOCK_CREDENTIALS.push(...Array.from({ length: 18 }, (_, index): Credential => ({
  id: `cred-021026-${String(index + 5).padStart(4, "0")}`,
  username: `branch-automation-${String(index + 1).padStart(2, "0")}`,
  password: `enc:v1:${String(1000 + index)}••••••`,
  secret: index % 2 === 0 ? `enc:v1:${String(3000 + index)}••••••` : null,
  encryption_type: "AES-256-GCM",
  created_at: "2026-10-02T08:00:00+07:00",
  last_updated_at: "2026-10-03T08:00:00+07:00",
  device_count: index % 4,
})))
