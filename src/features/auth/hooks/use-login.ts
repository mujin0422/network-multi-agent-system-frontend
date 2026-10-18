import { useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { POST_LOGIN_PATH } from "../constants/auth.constants"
import { MOCK_SUPER_ADMIN_CREDENTIALS } from "../mocks/auth.mock"
import type { AuthRedirectState } from "../types/login.type"
import {
  createAuthenticatedSession,
  getSafeRedirectPath,
  isValidLoginCredentials,
  readLoginCredentials,
} from "../utils/auth.util"

/** Quản lý tương tác của form đăng nhập demo. */
export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const credentials = readLoginCredentials(new FormData(event.currentTarget))

    if (!isValidLoginCredentials(credentials)) {
      setError("invalid-credentials")
      return
    }

    setError("")
    createAuthenticatedSession()
    const redirectState = location.state as AuthRedirectState | null
    navigate(getSafeRedirectPath(redirectState?.from ?? POST_LOGIN_PATH), {
      replace: true,
    })
  }

  return {
    credentials: MOCK_SUPER_ADMIN_CREDENTIALS,
    error,
    clearError: () => setError(""),
    showPassword,
    togglePassword: () => setShowPassword((current) => !current),
    submit,
  }
}
