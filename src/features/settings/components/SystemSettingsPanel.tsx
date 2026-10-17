import { Languages, Moon, RotateCcw, Sun, Type } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSystemSettingsData } from "../hooks/use-system-settings-data"
import type { FontFamily } from "../types/font-family.type"
import type { FontScale } from "../types/font-scale.type"
import { SegmentedControl, type SegmentOption } from "./SegmentedControl"
import { SettingRow } from "./SettingRow"

const FONT_PREVIEW: Record<FontFamily, string> = {
  inter: '"Inter Variable", Inter, sans-serif',
  system: "ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
}

/** Màn hình tùy chỉnh ngôn ngữ, giao diện và typography của ứng dụng. */
export function SystemSettingsPanel() {
  const { t } = useTranslation()
  const {
    theme,
    language,
    fontFamily,
    fontScale,
    setTheme,
    setLanguage,
    setFontFamily,
    setFontScale,
    resetPreferences,
  } = useSystemSettingsData()

  const languageOptions = [
    { value: "en" as const, label: "English" },
    { value: "vi" as const, label: "Tiếng Việt" },
  ]
  const themeOptions = [
    {
      value: "light" as const,
      label: t("systemSettings.theme.light"),
      icon: <Sun className="size-3" />,
    },
    {
      value: "dark" as const,
      label: t("systemSettings.theme.dark"),
      icon: <Moon className="size-3" />,
    },
  ]
  const fontOptions: SegmentOption<FontFamily>[] = (
    ["inter", "system", "mono"] as FontFamily[]
  ).map((font) => ({
    value: font,
    label: t(`systemSettings.typography.fonts.${font}.title`),
    style: { fontFamily: FONT_PREVIEW[font] },
  }))
  const scaleOptions: SegmentOption<FontScale>[] = (
    ["small", "default", "large"] as FontScale[]
  ).map((scale) => ({
    value: scale,
    label: t(`systemSettings.typography.sizes.${scale}.title`),
  }))
  const headerAction = (
    <Button variant="outline" size="sm" onClick={resetPreferences}>
      <RotateCcw />
      {t("systemSettings.reset")}
    </Button>
  )

  return (
    <PageLayout className="mx-auto w-full max-w-3xl">
      <PageLayoutHeader
        title="systemSettings.title"
        description="systemSettings.description"
      >
        {headerAction}
      </PageLayoutHeader>

      <PageLayoutContent className="space-y-4">
        <Card className="gap-0 py-0">
          <CardContent className="p-0">
            <SettingRow
              icon={<Languages className="size-3.5" />}
              title={t("systemSettings.language.title")}
              description={t("systemSettings.language.description")}
            >
              <SegmentedControl
                value={language}
                options={languageOptions}
                onChange={(next) => void setLanguage(next)}
              />
            </SettingRow>
            <SettingRow
              icon={
                theme === "dark" ? (
                  <Moon className="size-3.5" />
                ) : (
                  <Sun className="size-3.5" />
                )
              }
              title={t("systemSettings.theme.title")}
              description={t("systemSettings.theme.description")}
            >
              <SegmentedControl
                value={theme}
                options={themeOptions}
                onChange={setTheme}
              />
            </SettingRow>
            <SettingRow
              icon={<Type className="size-3.5" />}
              title={t("systemSettings.typography.fontFamily")}
              description={t("systemSettings.typography.fontFamilyDescription")}
            >
              <SegmentedControl
                value={fontFamily}
                options={fontOptions}
                onChange={setFontFamily}
              />
            </SettingRow>
            <SettingRow
              last
              icon={<span className="text-[10px] font-semibold">Aa</span>}
              title={t("systemSettings.typography.fontSize")}
              description={t("systemSettings.typography.fontSizeDescription")}
            >
              <SegmentedControl
                value={fontScale}
                options={scaleOptions}
                onChange={setFontScale}
              />
            </SettingRow>
          </CardContent>
        </Card>
        <p className="text-center text-[9px] text-muted-foreground">
          {t("systemSettings.savedAutomatically")}
        </p>
      </PageLayoutContent>
    </PageLayout>
  )
}
