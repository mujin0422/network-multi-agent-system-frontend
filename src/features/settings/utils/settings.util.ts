import type { AppearancePreferences } from "../types/appearance-preferences.type"
import type { FontFamily } from "../types/font-family.type"
import type { FontScale } from "../types/font-scale.type"

export const SETTINGS_STORAGE_KEY = "app-appearance"

export const DEFAULT_APPEARANCE_PREFERENCES: AppearancePreferences = { theme: "dark", fontFamily: "inter", fontScale: "default" }

const FONT_FAMILIES: Record<FontFamily, string> = {
  inter: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  system: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
}

const FONT_SIZES: Record<FontScale, string> = { small: "14px", default: "16px", large: "18px" }

export function readAppearancePreferences(): AppearancePreferences {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "null") as Partial<AppearancePreferences> | null
    return {
      theme: stored?.theme === "light" ? "light" : DEFAULT_APPEARANCE_PREFERENCES.theme,
      fontFamily: stored?.fontFamily && stored.fontFamily in FONT_FAMILIES ? stored.fontFamily : DEFAULT_APPEARANCE_PREFERENCES.fontFamily,
      fontScale: stored?.fontScale && stored.fontScale in FONT_SIZES ? stored.fontScale : DEFAULT_APPEARANCE_PREFERENCES.fontScale,
    }
  } catch {
    return DEFAULT_APPEARANCE_PREFERENCES
  }
}

export function applyAppearancePreferences(preferences: AppearancePreferences) {
  const root = document.documentElement
  root.classList.toggle("dark", preferences.theme === "dark")
  root.classList.toggle("light", preferences.theme === "light")
  root.style.setProperty("--app-font-family", FONT_FAMILIES[preferences.fontFamily])
  root.style.setProperty("--app-font-size", FONT_SIZES[preferences.fontScale])
}

export function persistAppearancePreferences(preferences: AppearancePreferences) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(preferences))
  applyAppearancePreferences(preferences)
}
