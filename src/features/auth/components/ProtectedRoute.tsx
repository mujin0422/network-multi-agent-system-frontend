import { Navigate, Outlet, useLocation } from "react-router-dom"

import { LOGIN_PATH } from "../constants/auth.constants"
import { hasAuthenticatedSession } from "../utils/auth.util"

/** Chặn các route nội bộ khi người dùng chưa có phiên đăng nhập. */
export function ProtectedRoute() {
  const location = useLocation()

  if (!hasAuthenticatedSession()) {
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
