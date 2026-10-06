import type { ProfileRole, ProfileUser } from "../types"

export const MOCK_PROFILE_ROLE: ProfileRole = {
  id: "role-0001",
  name: "Super Admin",
  created_at: "2026-09-01T08:00:00+07:00",
  last_updated_at: null,
}

export const MOCK_PROFILE_USER: ProfileUser = {
  id: "user-011026-0001",
  role_id: "role-0001",
  email: "thai.pham@network.ai",
  password_hashed: "$argon2id$v=19$••••",
  full_name: "Phạm Đình Duy Thái",
  status: "ACTIVE",
  refresh_token: "sha256:••••",
  expires_at: "2026-10-10T08:00:00+07:00",
  created_at: "2026-10-01T08:00:00+07:00",
  last_updated_at: "2026-10-02T10:20:00+07:00",
  last_login_at: "2026-10-03T09:28:00+07:00",
}
