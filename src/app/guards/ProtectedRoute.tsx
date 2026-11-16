import { useSyncExternalStore } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"

import { LOGIN_PATH } from "@/features/auth/constants/auth.constants"
import { hasStoredTokens, subscribeToTokenChanges } from "@/service/token-storage"

/** Chặn route nội bộ khi trình duyệt không còn phiên xác thực. */
export function ProtectedRoute() {
  const location = useLocation()
  const authenticated = useSyncExternalStore(
    subscribeToTokenChanges,
    hasStoredTokens,
    () => false,
  )

  if (!authenticated) {
    return (
      <Navigate
        to={LOGIN_PATH}
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    )
  }

  return <Outlet />
}
