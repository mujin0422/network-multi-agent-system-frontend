import { Check, Globe2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LANGUAGE_OPTIONS } from "@/constants/components"
import { useLocale } from "@/i18n/use-locale"
import type { LanguageSwitcherProps } from "@/types/components"

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { t } = useTranslation()
  const { language, changeLanguage } = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size={compact ? "icon-sm" : "sm"} aria-label={t("common.language")} className="text-muted-foreground" />}>
        <Globe2 />
        {!compact && <span>{language.toUpperCase()}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
        {LANGUAGE_OPTIONS.map((item) => (
          <DropdownMenuItem key={item.code} onClick={() => void changeLanguage(item.code)}>
            <span className="w-5 text-[10px] font-semibold text-muted-foreground">{item.shortLabel}</span>
            <span className="flex-1">{t(item.labelKey)}</span>
            {language === item.code && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
