export function normalizeFallbackPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`
}
