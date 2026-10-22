const ACCESS_TOKEN_KEY = "network-ai-access-token"
const REFRESH_TOKEN_KEY = "network-ai-refresh-token"

export type StoredTokens = {
  accessToken: string
  refreshToken: string
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function storeTokens(tokens: StoredTokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function hasStoredTokens() {
  return Boolean(getAccessToken() && getRefreshToken())
}
