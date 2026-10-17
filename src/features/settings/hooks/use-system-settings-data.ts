import { useState } from "react"

import { useLocale } from "@/i18n/use-locale"
import type { AppearancePreferences } from "../types/appearance-preferences.type"
import type { FontFamily } from "../types/font-family.type"
import type { FontScale } from "../types/font-scale.type"
import type { ThemeMode } from "../types/theme-mode.type"
import { applyAppearancePreferences, DEFAULT_APPEARANCE_PREFERENCES, persistAppearancePreferences, readAppearancePreferences } from "../utils/settings.util"

// Khởi tạo giao diện ứng dụng từ tùy chọn đã lưu.
export function initializeAppearance() {
  applyAppearancePreferences(readAppearancePreferences())
}

// Quản lý ngôn ngữ và các tùy chọn hiển thị của hệ thống.
export function useSystemSettingsData() {
  const [preferences, setPreferences] = useState<AppearancePreferences>(readAppearancePreferences)
  const { language, changeLanguage } = useLocale()

  // Hợp nhất và lưu một phần tùy chọn giao diện được thay đổi.
  function updatePreferences(changes: Partial<AppearancePreferences>) {
    // Tạo trạng thái tùy chọn mới từ trạng thái hiện tại và phần thay đổi.
    function updateCurrentPreferences(current: AppearancePreferences) {
      const next = { ...current, ...changes }
      persistAppearancePreferences(next)
      return next
    }

    setPreferences(updateCurrentPreferences)
  }

  // Khôi phục tùy chọn giao diện và ngôn ngữ về giá trị mặc định.
  function resetPreferences() {
    persistAppearancePreferences(DEFAULT_APPEARANCE_PREFERENCES)
    setPreferences(DEFAULT_APPEARANCE_PREFERENCES)
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
