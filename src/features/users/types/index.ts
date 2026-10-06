export type UserStatus = "ACTIVE" | "DISABLED"
export type User = { id: string; role_id: string; email: string; password_hashed: string; full_name: string; status: UserStatus; refresh_token: string | null; expires_at: string | null; created_at: string; last_updated_at: string | null; last_login_at: string | null }
export type Role = { id: string; name: string; created_at: string; last_updated_at: string | null }
