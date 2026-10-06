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

// Đọc và chuẩn hóa tùy chọn giao diện đã lưu trong localStorage.
function readPreferences(): AppearancePreferences {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<AppearancePreferences> | null
    let theme = DEFAULT_PREFERENCES.theme
    let fontFamily = DEFAULT_PREFERENCES.fontFamily
    let fontScale = DEFAULT_PREFERENCES.fontScale

    if (stored?.theme === "light") {
      theme = "light"
    }

    if (stored?.fontFamily && stored.fontFamily in FONT_FAMILIES) {
      fontFamily = stored.fontFamily
    }

    if (stored?.fontScale && stored.fontScale in FONT_SIZES) {
      fontScale = stored.fontScale
    }

    return {
      theme,
      fontFamily,
      fontScale,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

// Áp dụng tùy chọn giao diện lên phần tử gốc của tài liệu.
function applyPreferences(preferences: AppearancePreferences) {
  const root = document.documentElement
  root.classList.toggle("dark", preferences.theme === "dark")
  root.classList.toggle("light", preferences.theme === "light")
  root.style.setProperty("--app-font-family", FONT_FAMILIES[preferences.fontFamily])
  root.style.setProperty("--app-font-size", FONT_SIZES[preferences.fontScale])
}

// Lưu tùy chọn giao diện và áp dụng ngay thay đổi lên trang.
function persistPreferences(preferences: AppearancePreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  applyPreferences(preferences)
}

// Khởi tạo giao diện ứng dụng từ tùy chọn đã lưu.
export function initializeAppearance() {
  applyPreferences(readPreferences())
}

// Quản lý ngôn ngữ và các tùy chọn hiển thị của hệ thống.
export function useSystemSettingsData() {
  const [preferences, setPreferences] = useState<AppearancePreferences>(readPreferences)
  const { language, changeLanguage } = useLocale()

  // Hợp nhất và lưu một phần tùy chọn giao diện được thay đổi.
  function updatePreferences(changes: Partial<AppearancePreferences>) {
    // Tạo trạng thái tùy chọn mới từ trạng thái hiện tại và phần thay đổi.
    function updateCurrentPreferences(current: AppearancePreferences) {
      const next = { ...current, ...changes }
      persistPreferences(next)
      return next
    }

    setPreferences(updateCurrentPreferences)
  }

  // Khôi phục tùy chọn giao diện và ngôn ngữ về giá trị mặc định.
  function resetPreferences() {
    persistPreferences(DEFAULT_PREFERENCES)
    setPreferences(DEFAULT_PREFERENCES)
    void changeLanguage("en")
  }

  // Cập nhật chế độ màu của giao diện.
  function setTheme(theme: ThemeMode) {
    updatePreferences({ theme })
  }

  // Cập nhật họ phông chữ của giao diện.
  function setFontFamily(fontFamily: FontFamily) {
    updatePreferences({ fontFamily })
  }

  // Cập nhật kích thước chữ của giao diện.
  function setFontScale(fontScale: FontScale) {
    updatePreferences({ fontScale })
  }

  return {
    ...preferences,
    language,
    setTheme,
    setFontFamily,
    setFontScale,
    setLanguage: changeLanguage,
    resetPreferences,
  }
}
