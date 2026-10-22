import { useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { POST_LOGIN_PATH } from "../constants/auth.constants"
import { MOCK_SUPER_ADMIN_CREDENTIALS } from "../mocks/auth.mock"
import type { AuthRedirectState } from "../types/login.type"
import {
  getSafeRedirectPath,
  readLoginCredentials,
} from "../utils/auth.util"
import { authApi, toApiError } from "@/service"

/** Quản lý tương tác của form đăng nhập demo. */
export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const credentials = readLoginCredentials(new FormData(event.currentTarget))

    try {
      setIsSubmitting(true)
      setError("")
      await authApi.login(credentials)
      const redirectState = location.state as AuthRedirectState | null
      navigate(getSafeRedirectPath(redirectState?.from ?? POST_LOGIN_PATH), {
        replace: true,
      })
    } catch (requestError) {
      const apiError = toApiError(requestError)
      setError(apiError.status === 401 ? "invalid-credentials" : apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    credentials: MOCK_SUPER_ADMIN_CREDENTIALS,
    error,
    isSubmitting,
    clearError: () => setError(""),
    showPassword,
    togglePassword: () => setShowPassword((current) => !current),
    submit,
  }
}
