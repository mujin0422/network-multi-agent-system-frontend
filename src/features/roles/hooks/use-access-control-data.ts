import { useCallback, useEffect, useMemo, useState } from "react"
import { accessControlApi, rolesApi } from "@/service"
import type { RoleCreate, RoleUpdate } from "@/service"
import type { Action } from "../types/action.type"
import type { ManagementFunction } from "../types/management-function.type"
import type { Permission } from "../types/permission.type"
import type { Role } from "../types/role.type"
import type { RolePermission } from "../types/role-permission.type"
import { findPermission } from "../utils/roles.util"

export function useAccessControlData() {
  const [roles, setRoles] = useState<Role[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [functions, setFunctions] = useState<ManagementFunction[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [activeRoleId, setActiveRoleId] = useState("")
  const [grants, setGrants] = useState<RolePermission[]>([])
  const [draftGrants, setDraftGrants] = useState<RolePermission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [roleRows, catalog] = await Promise.all([
        rolesApi.list(),
        accessControlApi.getCatalog(),
      ])
      setRoles(roleRows)
      setActions(catalog.actions)
      setFunctions(catalog.functions)
      setPermissions(catalog.permissions)
      setActiveRoleId((current) =>
        current && roleRows.some((role) => role.id === current)
          ? current
          : roleRows[0]?.id ?? "",
      )
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải dữ liệu phân quyền")
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ catalog phân quyền với API khi mount.
  useEffect(() => { void reload() }, [reload])

  useEffect(() => {
    if (!activeRoleId) {
      return
    }
    let active = true
    void accessControlApi.listRolePermissions(activeRoleId)
      .then((rows) => {
        if (!active) return
        setGrants(rows)
        setDraftGrants(rows)
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Không thể tải quyền của vai trò")
      })
    return () => { active = false }
  }, [activeRoleId])

  const roleGrants = useMemo(
    () => new Set(draftGrants.map((item) => item.permission_id)),
    [draftGrants],
  )

  const hasChanges = useMemo(() => {
    const saved = new Set(grants.map((item) => item.permission_id))
    return saved.size !== roleGrants.size || [...saved].some((id) => !roleGrants.has(id))
  }, [grants, roleGrants])

  function toggle(functionId: string, actionId: string) {
    const permission = findPermission(permissions, functionId, actionId)
    const activeRole = roles.find((role) => role.id === activeRoleId)
    if (!permission || activeRole?.name.toLowerCase() === "super admin") return

    setDraftGrants((current) => {
      if (current.some((item) => item.permission_id === permission.id)) {
        return current.filter((item) => item.permission_id !== permission.id)
      }
      return [...current, { role_id: activeRoleId, permission_id: permission.id }]
    })
  }

  function selectRole(roleId: string) {
    setActiveRoleId(roleId)
  }

  async function saveChanges() {
    if (!activeRoleId || !hasChanges) return
    setSaving(true)
    setError(null)
    try {
      const rows = await accessControlApi.replaceRolePermissions(activeRoleId, [...roleGrants])
      setGrants(rows)
      setDraftGrants(rows)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu thay đổi phân quyền")
    } finally {
      setSaving(false)
    }
  }

  const createRole = useCallback(async (payload: RoleCreate) => {
    await rolesApi.create(payload)
    await reload()
  }, [reload])

  const updateRole = useCallback(async (id: string, payload: RoleUpdate) => {
    await rolesApi.update(id, payload)
    await reload()
  }, [reload])

  return {
    activeRoleId, actions, functions, permissions, roles, roleGrants,
    hasChanges, loading, saving, error, reload, selectRole, saveChanges,
    toggle, createRole, updateRole,
  }
}
