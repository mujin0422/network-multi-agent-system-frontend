import { useCallback, useEffect, useState } from "react"
import { authApi, getAccessToken, rolesApi, usersApi } from "@/service"
import type { ProfileMode } from "../types/profile-mode.type"
import type { ProfileRole } from "../types/profile-role.type"
import type { ProfileSession } from "../types/profile-session.type"
import type { ProfileUser } from "../types/profile-user.type"

const emptyProfile: ProfileUser = { id: "", role_id: "", email: "", full_name: "", user_status: "ACTIVE", created_at: new Date(0).toISOString(), last_updated_at: null, last_login_at: null }
const emptyRole: ProfileRole = { id: "", name: "—", created_at: new Date(0).toISOString(), last_updated_at: null }

function readSession(): ProfileSession {
  try {
    const token = getAccessToken()
    if (!token) throw new Error()
    const payload = JSON.parse(atob(token.split(".")[1].replaceAll("-", "+").replaceAll("_", "/"))) as { sid?: string; exp?: number }
    return { id: payload.sid ?? "current-session", expires_at: new Date((payload.exp ?? 0) * 1000).toISOString() }
  } catch { return { id: "current-session", expires_at: new Date(0).toISOString() } }
}

export function useProfileData() {
  const [profile, setProfile] = useState<ProfileUser>(emptyProfile)
  const [role, setRole] = useState<ProfileRole>(emptyRole)
  const [session] = useState(readSession)
  const [mode, setMode] = useState<ProfileMode>("view")
  const [error, setError] = useState<string | null>(null)
  const reload = useCallback(async () => {
    try {
      const user = await authApi.me()
      const userRole = await rolesApi.get(user.role_id)
      setProfile(user); setRole(userRole)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải hồ sơ") }
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reload() }, [reload])
  async function saveProfile(changes: Pick<ProfileUser, "full_name" | "email">) {
    const updated = await usersApi.update(profile.id, changes)
    setProfile(updated); setMode("view")
  }
  return { profile, role, session, mode, error, setMode, saveProfile }
}
