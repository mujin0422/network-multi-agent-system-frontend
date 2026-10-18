import { Languages, Moon, RotateCcw, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSystemSettingsData } from "../hooks/use-system-settings-data"
import { SegmentedControl } from "./SegmentedControl"
import { SettingRow } from "./SettingRow"

/** Màn hình tùy chỉnh ngôn ngữ và giao diện của ứng dụng. */
export function SystemSettingsPanel() {
  const { t } = useTranslation()
  const {
    theme,
    language,
    setTheme,
    setLanguage,
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
              icon={<Languages className="size-4" />}
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
              last
              icon={
                theme === "dark" ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
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
          </CardContent>
        </Card>
        <p className="text-center type-caption text-muted-foreground">
          {t("systemSettings.savedAutomatically")}
        </p>
      </PageLayoutContent>
    </PageLayout>
  )
}
