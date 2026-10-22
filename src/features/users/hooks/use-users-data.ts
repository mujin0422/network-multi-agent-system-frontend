import { useCallback, useEffect, useMemo, useState } from "react"
import { rolesApi, usersApi } from "@/service"
import type { Role, UserCreate, UserUpdate } from "@/service"
import type { User } from "../types/user.type"
import { roleName as resolveRoleName } from "../utils/users.util"

export function useUsersData() {
  const [rows, setRows] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      const [users, roleRows] = await Promise.all([usersApi.list(), rolesApi.list()])
      setRows(users)
      setRoles(roleRows)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải người dùng")
    } finally { setLoading(false) }
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reload() }, [reload])

  const createUser = useCallback(async (payload: UserCreate) => { await usersApi.create(payload); await reload() }, [reload])
  const updateUser = useCallback(async (id: string, payload: UserUpdate) => { await usersApi.update(id, payload); await reload() }, [reload])
  function roleName(id: string) { return resolveRoleName(roles, id) }
  const summary = useMemo(() => ({
    total: rows.length,
    active: rows.filter((user) => user.user_status === "ACTIVE").length,
    rolesAssigned: new Set(rows.map((user) => user.role_id)).size,
    loggedIn: rows.filter((user) => Boolean(user.last_login_at)).length,
  }), [rows])
  return { rows, roles, roleName, summary, loading, error, reload, createUser, updateUser }
}
