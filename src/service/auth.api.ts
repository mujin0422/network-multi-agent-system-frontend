import { api } from "./api"
import type { LoginRequest, TokenResponse, User } from "./contracts"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  storeTokens,
} from "./token-storage"

export const authApi = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<TokenResponse>("/auth/login", payload)
    storeTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
    return data
  },

  async refresh() {
    const refreshToken = getRefreshToken()
    if (!refreshToken) throw new Error("Không có refresh token")
    const { data } = await api.post<TokenResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    })
    storeTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
    return data
  },

  async logout() {
    const accessToken = getAccessToken()
    clearTokens()
    if (!accessToken) return

    try {
      await api.post(
        "/auth/logout",
        undefined,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
    } catch {
      // Local logout đã hoàn tất; session server sẽ tự hết hạn nếu không truy cập được.
    }
  },

  async me() {
    return (await api.get<User>("/auth/me")).data
  },
}
