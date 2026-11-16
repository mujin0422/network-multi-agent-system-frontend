import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { authApi } from "@/features/auth/api/auth.api"

type RoleGuardProps = {
  allowedRoleIds: readonly string[]
  fallbackPath?: string
}

/** Chỉ cho phép những role đã khai báo đi tiếp vào nhánh route con. */
export function RoleGuard({ allowedRoleIds, fallbackPath = "/" }: RoleGuardProps) {
  const [roleId, setRoleId] = useState<string | null>()

  useEffect(() => {
    let active = true
    void authApi.me()
      .then((user) => { if (active) setRoleId(user.role_id) })
      .catch(() => { if (active) setRoleId(null) })
    return () => { active = false }
  }, [])

  if (roleId === undefined) {
    return <PageLoadingSkeleton title="Loading" description="Checking access permissions" />
  }
  if (roleId === null || !allowedRoleIds.includes(roleId)) {
    return <Navigate to={fallbackPath} replace />
  }
  return <Outlet />
}
