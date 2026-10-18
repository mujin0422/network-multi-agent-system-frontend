import type { AppearancePreferences } from "../types/appearance-preferences.type"

export const SETTINGS_STORAGE_KEY = "app-appearance"

export const DEFAULT_APPEARANCE_PREFERENCES: AppearancePreferences = {
  theme: "dark",
}

export function readAppearancePreferences(): AppearancePreferences {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "null") as Partial<AppearancePreferences> | null
    return {
      theme: stored?.theme === "light" ? "light" : DEFAULT_APPEARANCE_PREFERENCES.theme,
    }
  } catch {
    return DEFAULT_APPEARANCE_PREFERENCES
  }
}

export function applyAppearancePreferences(preferences: AppearancePreferences) {
  const root = document.documentElement
  root.classList.toggle("dark", preferences.theme === "dark")
  root.classList.toggle("light", preferences.theme === "light")
  root.style.removeProperty("--app-font-family")
  root.style.removeProperty("--app-font-size")
}

export function persistAppearancePreferences(preferences: AppearancePreferences) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(preferences))
  applyAppearancePreferences(preferences)
}
