export type ProfileUser = {
  id: string
  role_id: string
  email: string
  password_hash: string
  full_name: string
  user_status: "ACTIVE" | "DISABLED"
  created_at: string
  last_updated_at: string | null
  last_login_at: string | null
}
