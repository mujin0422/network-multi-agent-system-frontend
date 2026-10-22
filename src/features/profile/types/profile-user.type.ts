export type ProfileUser = {
  id: string
  role_id: string
  email: string
  full_name: string
  user_status: "ACTIVE" | "DISABLED"
  created_at: string
  last_updated_at: string | null
  last_login_at: string | null
  /** Chỉ giữ optional để tương thích dữ liệu mock cũ; API không bao giờ trả password hash. */
  password_hash?: string
}
