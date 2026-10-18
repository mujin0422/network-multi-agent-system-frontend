import type { LoginCredentials } from "../types/login.type"
import { AUTH_STORAGE_KEY, POST_LOGIN_PATH } from "../constants/auth.constants"
import { MOCK_SUPER_ADMIN_CREDENTIALS } from "../mocks/auth.mock"

/** Đọc và chuẩn hóa dữ liệu từ form đăng nhập. */
export function readLoginCredentials(formData: FormData): LoginCredentials {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  }
}

/** Kiểm tra thông tin đăng nhập demo trước khi tạo phiên. */
export function isValidLoginCredentials(credentials: LoginCredentials) {
  return (
    credentials.email === MOCK_SUPER_ADMIN_CREDENTIALS.email &&
    credentials.password === MOCK_SUPER_ADMIN_CREDENTIALS.password
  )
}

export function hasAuthenticatedSession() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true"
}

export function createAuthenticatedSession() {
  localStorage.setItem(AUTH_STORAGE_KEY, "true")
}

export function clearAuthenticatedSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getSafeRedirectPath(path?: string) {
  return path?.startsWith("/") && !path.startsWith("//")
    ? path
    : POST_LOGIN_PATH
}
