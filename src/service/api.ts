import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"

import type { TokenResponse } from "./contracts"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  storeTokens,
} from "./token-storage"

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = (
  configuredBaseUrl || "http://localhost:8000/api/v1"
).replace(/\/$/, "")

export type ApiErrorPayload = {
  detail?: string | Array<{ loc: Array<string | number>; msg: string; type: string }>
}

export class ApiError extends Error {
  readonly status: number | null
  readonly payload: ApiErrorPayload | null

  constructor(
    message: string,
    status: number | null,
    payload: ApiErrorPayload | null,
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.payload = payload
  }
}

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 120_000,
})

const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
})

let refreshPromise: Promise<string> | null = null

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const request = error.config as RetryableRequest | undefined
    const isAuthenticationEndpoint = request?.url?.startsWith("/auth/")

    if (error.response?.status === 401 && request && !request._retry && !isAuthenticationEndpoint) {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearTokens()
        return Promise.reject(toApiError(error))
      }

      request._retry = true
      refreshPromise ??= refreshApi
        .post<TokenResponse>("/auth/refresh", { refresh_token: refreshToken })
        .then(({ data }) => {
          storeTokens({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          })
          return data.access_token
        })
        .catch((refreshError: AxiosError<ApiErrorPayload>) => {
          clearTokens()
          throw toApiError(refreshError)
        })
        .finally(() => {
          refreshPromise = null
        })

      const accessToken = await refreshPromise
      request.headers.Authorization = `Bearer ${accessToken}`
      return api(request)
    }

    return Promise.reject(toApiError(error))
  },
)

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (!axios.isAxiosError<ApiErrorPayload>(error)) {
    return new ApiError("Đã xảy ra lỗi không xác định", null, null)
  }

  const payload = error.response?.data ?? null
  const detail = payload?.detail
  const message =
    typeof detail === "string"
      ? detail
      : Array.isArray(detail)
        ? detail.map((item) => item.msg).join(", ")
        : error.message || "Không thể kết nối đến máy chủ"

  return new ApiError(message, error.response?.status ?? null, payload)
}
