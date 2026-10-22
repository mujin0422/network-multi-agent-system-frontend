import type { LoginCredentials } from "../types/login.type"
import { POST_LOGIN_PATH } from "../constants/auth.constants"
import { authApi, hasStoredTokens } from "@/service"

/** Đọc và chuẩn hóa dữ liệu từ form đăng nhập. */
export function readLoginCredentials(formData: FormData): LoginCredentials {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  }
}

export function hasAuthenticatedSession() {
  return hasStoredTokens()
}

export function clearAuthenticatedSession() {
  void authApi.logout()
}

export function getSafeRedirectPath(path?: string) {
  return path?.startsWith("/") && !path.startsWith("//")
    ? path
    : POST_LOGIN_PATH
}
