export type ThemeMode = "light" | "dark"
export type FontFamily = "inter" | "system" | "mono"
export type FontScale = "small" | "default" | "large"

export type AppearancePreferences = {
  theme: ThemeMode
  fontFamily: FontFamily
  fontScale: FontScale
}

// Kept for compatibility with the existing mock resource data.
export type { ResourceModuleConfig, ResourceRow, ResourceStatus } from "@/features/_shared/resource/types"
