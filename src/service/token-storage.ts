const ACCESS_TOKEN_KEY = "network-ai-access-token"
const REFRESH_TOKEN_KEY = "network-ai-refresh-token"

type TokenChangeListener = () => void

const tokenChangeListeners = new Set<TokenChangeListener>()

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
  notifyTokenChange()
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  notifyTokenChange()
}

export function hasStoredTokens() {
  return Boolean(getAccessToken() && getRefreshToken())
}

function notifyTokenChange() {
  tokenChangeListeners.forEach((listener) => listener())
}

/** Đồng bộ trạng thái xác thực giữa API client, route guard và các tab trình duyệt. */
export function subscribeToTokenChanges(listener: TokenChangeListener) {
  tokenChangeListeners.add(listener)

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === ACCESS_TOKEN_KEY || event.key === REFRESH_TOKEN_KEY) {
      listener()
    }
  }

  window.addEventListener("storage", handleStorageChange)

  return () => {
    tokenChangeListeners.delete(listener)
    window.removeEventListener("storage", handleStorageChange)
  }
}
