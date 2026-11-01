import { useSyncExternalStore } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"

import { hasStoredTokens, subscribeToTokenChanges } from "@/service/token-storage"

import { LOGIN_PATH } from "../constants/auth.constants"

/** Chặn các route nội bộ khi người dùng chưa có phiên đăng nhập. */
export function ProtectedRoute() {
  const location = useLocation()
  const hasAuthenticatedSession = useSyncExternalStore(
    subscribeToTokenChanges,
    hasStoredTokens,
    () => false,
  )

  if (!hasAuthenticatedSession) {
    return (
      <Navigate
        to={LOGIN_PATH}
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    )
  }

  return <Outlet />
}
