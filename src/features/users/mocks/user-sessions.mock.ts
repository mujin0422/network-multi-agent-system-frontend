import type { UserSession } from "../types/user-session.type"

export const MOCK_USER_SESSIONS: UserSession[] = [
  { id: "sess-171026-0001", user_id: "user-011026-0001", refresh_token_hash: "sha256:••••••••", expires_at: "2026-10-24T08:00:00+07:00", revoked_at: null, created_at: "2026-10-17T08:00:00+07:00" },
  { id: "sess-171026-0002", user_id: "user-011026-0002", refresh_token_hash: "sha256:••••••••", expires_at: "2026-10-24T09:00:00+07:00", revoked_at: null, created_at: "2026-10-17T09:00:00+07:00" },
]
