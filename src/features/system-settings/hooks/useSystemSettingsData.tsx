import { useState } from "react"

import { useLocale } from "@/i18n/use-locale"
import type { AppearancePreferences, FontFamily, FontScale, ThemeMode } from "../types"

const STORAGE_KEY = "app-appearance"

const DEFAULT_PREFERENCES: AppearancePreferences = {
  theme: "dark",
  fontFamily: "inter",
  fontScale: "default",
}

const FONT_FAMILIES: Record<FontFamily, string> = {
  inter: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  system: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
}

const FONT_SIZES: Record<FontScale, string> = {
  small: "14px",
  default: "16px",
  large: "18px",
}

function readPreferences(): AppearancePreferences {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<AppearancePreferences> | null
    return {
      theme: stored?.theme === "light" ? "light" : DEFAULT_PREFERENCES.theme,
      fontFamily: stored?.fontFamily && stored.fontFamily in FONT_FAMILIES ? stored.fontFamily : DEFAULT_PREFERENCES.fontFamily,
      fontScale: stored?.fontScale && stored.fontScale in FONT_SIZES ? stored.fontScale : DEFAULT_PREFERENCES.fontScale,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

function applyPreferences(preferences: AppearancePreferences) {
  const root = document.documentElement
  root.classList.toggle("dark", preferences.theme === "dark")
  root.classList.toggle("light", preferences.theme === "light")
  root.style.setProperty("--app-font-family", FONT_FAMILIES[preferences.fontFamily])
  root.style.setProperty("--app-font-size", FONT_SIZES[preferences.fontScale])
}

function persistPreferences(preferences: AppearancePreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  applyPreferences(preferences)
}

export function initializeAppearance() {
  applyPreferences(readPreferences())
}

export function useSystemSettingsData() {
  const [preferences, setPreferences] = useState<AppearancePreferences>(readPreferences)
  const { language, changeLanguage } = useLocale()

  const updatePreferences = (changes: Partial<AppearancePreferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...changes }
      persistPreferences(next)
      return next
    })
  }

  const resetPreferences = () => {
    persistPreferences(DEFAULT_PREFERENCES)
    setPreferences(DEFAULT_PREFERENCES)
    void changeLanguage("en")
  }

  return {
    ...preferences,
    language,
    setTheme: (theme: ThemeMode) => updatePreferences({ theme }),
    setFontFamily: (fontFamily: FontFamily) => updatePreferences({ fontFamily }),
    setFontScale: (fontScale: FontScale) => updatePreferences({ fontScale }),
    setLanguage: changeLanguage,
    resetPreferences,
  }
}
