import { useState } from "react"
import { MOCK_PROFILE_ROLE, MOCK_PROFILE_USER } from "../data"
import type { ProfileMode, ProfileUser } from "../types"

export function useProfileData() {
  const [profile, setProfile] = useState(MOCK_PROFILE_USER)
  const [mode, setMode] = useState<ProfileMode>("view")
  const saveProfile = (changes: Pick<ProfileUser, "full_name" | "email">) => {
    setProfile((current) => ({ ...current, ...changes, last_updated_at: new Date().toISOString() }))
    setMode("view")
  }
  return { profile, role: MOCK_PROFILE_ROLE, mode, setMode, saveProfile }
}
