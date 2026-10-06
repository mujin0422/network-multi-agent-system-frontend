import type { Role, User } from "../types"
export const MOCK_ROLES: Role[] = [{ id: "role-0001", name: "Super Admin", created_at: "2026-09-01T08:00:00+07:00", last_updated_at: null }, { id: "role-0002", name: "Network Engineer", created_at: "2026-09-01T08:00:00+07:00", last_updated_at: null }, { id: "role-0003", name: "Network Operator", created_at: "2026-09-01T08:00:00+07:00", last_updated_at: null }, { id: "role-0004", name: "Auditor", created_at: "2026-09-01T08:00:00+07:00", last_updated_at: null }]
export const MOCK_USERS: User[] = [
  { id: "user-011026-0001", role_id: "role-0001", email: "thai.pham@network.ai", password_hashed: "$argon2id$v=19$••••", full_name: "Phạm Đình Duy Thái", status: "ACTIVE", refresh_token: "sha256:••••", expires_at: "2026-10-10T08:00:00+07:00", created_at: "2026-10-01T08:00:00+07:00", last_updated_at: "2026-10-02T10:20:00+07:00", last_login_at: "2026-10-03T09:28:00+07:00" },
  { id: "user-011026-0002", role_id: "role-0002", email: "linh.nguyen@network.ai", password_hashed: "$argon2id$v=19$••••", full_name: "Nguyễn Hoàng Linh", status: "ACTIVE", refresh_token: "sha256:••••", expires_at: "2026-10-09T08:00:00+07:00", created_at: "2026-10-01T08:05:00+07:00", last_updated_at: null, last_login_at: "2026-10-03T08:45:00+07:00" },
  { id: "user-011026-0003", role_id: "role-0003", email: "minh.tran@network.ai", password_hashed: "$argon2id$v=19$••••", full_name: "Trần Quang Minh", status: "ACTIVE", refresh_token: null, expires_at: null, created_at: "2026-10-01T08:10:00+07:00", last_updated_at: "2026-10-02T15:00:00+07:00", last_login_at: "2026-10-02T17:42:00+07:00" },
  { id: "user-021026-0004", role_id: "role-0004", email: "audit@network.ai", password_hashed: "$argon2id$v=19$••••", full_name: "Security Audit", status: "DISABLED", refresh_token: null, expires_at: null, created_at: "2026-10-02T09:00:00+07:00", last_updated_at: "2026-10-03T07:15:00+07:00", last_login_at: null },
]

MOCK_USERS.push(...Array.from({ length: 20 }, (_, index): User => ({
  id: `user-021026-${String(index + 5).padStart(4, "0")}`,
  role_id: `role-000${index % 4 + 1}`,
  email: `network.user${index + 1}@network.ai`,
  password_hashed: "$argon2id$v=19$••••",
  full_name: `Network User ${String(index + 1).padStart(2, "0")}`,
  status: index % 8 === 0 ? "DISABLED" : "ACTIVE",
  refresh_token: index % 3 === 0 ? null : "sha256:••••",
  expires_at: index % 3 === 0 ? null : "2026-10-10T08:00:00+07:00",
  created_at: "2026-10-02T09:00:00+07:00",
  last_updated_at: "2026-10-03T07:30:00+07:00",
  last_login_at: index % 3 === 0 ? null : "2026-10-03T08:30:00+07:00",
})))
