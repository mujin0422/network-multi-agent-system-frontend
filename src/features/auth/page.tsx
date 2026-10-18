import { Navigate } from "react-router-dom"

import { POST_LOGIN_PATH } from "./constants/auth.constants"
import { LoginView } from "./components/LoginView"
import { hasAuthenticatedSession } from "./utils/auth.util"

export default function LoginPage() {
  if (hasAuthenticatedSession()) {
    return <Navigate to={POST_LOGIN_PATH} replace />
  }

  return <LoginView />
}
