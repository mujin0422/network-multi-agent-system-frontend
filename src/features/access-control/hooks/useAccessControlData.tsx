import { useMemo, useState } from "react"
import { MOCK_FUNCTIONS, MOCK_PERMISSIONS, MOCK_ROLE_PERMISSIONS, MOCK_ROLES } from "../data"

export function useAccessControlData() {
  const [activeRoleId, setActiveRoleId] = useState(MOCK_ROLES[1].id)
  const [grants, setGrants] = useState(MOCK_ROLE_PERMISSIONS)
  const roleGrants = useMemo(() => new Set(grants.filter((item) => item.role_id === activeRoleId).map((item) => item.permission_id)), [activeRoleId, grants])
  const toggle = (functionId: string, actionId: string) => {
    const permission = MOCK_PERMISSIONS.find((item) => item.function_id === functionId && item.action_id === actionId)
    if (!permission || activeRoleId === "role-0001") return
    setGrants((current) => roleGrants.has(permission.id) ? current.filter((item) => !(item.role_id === activeRoleId && item.permission_id === permission.id)) : [...current, { role_id: activeRoleId, permission_id: permission.id }])
  }
  return { activeRoleId, functions: MOCK_FUNCTIONS, roles: MOCK_ROLES, roleGrants, setActiveRoleId, toggle }
}
