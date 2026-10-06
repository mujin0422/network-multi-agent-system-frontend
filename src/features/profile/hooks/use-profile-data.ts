import { useState } from "react"
import { MOCK_PROFILE_ROLE, MOCK_PROFILE_USER } from "../data"
import type { ProfileMode, ProfileUser } from "../types"

// Quản lý dữ liệu hồ sơ và chế độ xem hoặc chỉnh sửa hồ sơ.
export function useProfileData() {
  const [profile, setProfile] = useState(MOCK_PROFILE_USER)
  const [mode, setMode] = useState<ProfileMode>("view")

  // Lưu thay đổi hồ sơ và đưa giao diện trở lại chế độ xem.
  function saveProfile(changes: Pick<ProfileUser, "full_name" | "email">) {
    // Hợp nhất thay đổi và cập nhật thời điểm chỉnh sửa hồ sơ.
    function updateProfile(current: ProfileUser) {
      return {
        ...current,
        ...changes,
        last_updated_at: new Date().toISOString(),
      }
    }

    setProfile(updateProfile)
    setMode("view")
  }
  return { profile, role: MOCK_PROFILE_ROLE, mode, setMode, saveProfile }
}
