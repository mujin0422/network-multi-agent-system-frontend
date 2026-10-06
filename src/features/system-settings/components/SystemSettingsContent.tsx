import { Languages, Moon, RotateCcw, Sun, Type } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { FeatureHeader } from "@/components/common/FeatureShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useSystemSettingsData } from "../hooks/useSystemSettingsData"
import type { FontFamily, FontScale } from "../types"

const FONT_PREVIEW: Record<FontFamily, string> = {
  inter: '"Inter Variable", Inter, sans-serif',
  system: "ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
}

type SegmentOption<T extends string> = {
  value: T
  label: string
  icon?: ReactNode
  style?: CSSProperties
}

/** Nhóm lựa chọn một giá trị, hiển thị theo dạng segmented control. */
function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: SegmentOption<T>[]
  onChange: (value: T) => void
}) {
  return (
    <div
      className="inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-muted p-1"
      role="group"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          style={option.style}
          className={cn(
            "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            value === option.value &&
              "bg-background text-foreground shadow-sm ring-1 ring-border",
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** Hàng thiết lập gồm thông tin mô tả và control thay đổi giá trị. */
function SettingRow({
  icon,
  title,
  description,
  children,
  last = false,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
  last?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center",
        !last && "border-b",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-semibold">{title}</h2>
          <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0 pl-10 sm:pl-0">{children}</div>
    </div>
  )
}

/** Màn hình tùy chỉnh ngôn ngữ, giao diện và typography của ứng dụng. */
export function SystemSettingsContent() {
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

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <FeatureHeader
        title={t("systemSettings.title")}
        description={t("systemSettings.description")}
        action={
          <Button variant="outline" size="sm" onClick={resetPreferences}>
            <RotateCcw />
            {t("systemSettings.reset")}
          </Button>
        }
      />

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
    </div>
  )
}
