import type { UserStatus } from "./user-status.type"

export type User = { id: string; role_id: string; email: string; password_hash: string; full_name: string; user_status: UserStatus; created_at: string; last_updated_at: string | null; last_login_at: string | null }
