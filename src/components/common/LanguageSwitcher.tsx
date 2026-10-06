import { Check, Globe2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "@/i18n/use-locale"

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  const { language, changeLanguage } = useLocale()
  const languages = [
    { code: "vi" as const, label: t("common.vietnamese"), shortLabel: "VI" },
    { code: "en" as const, label: t("common.english"), shortLabel: "EN" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size={compact ? "icon-sm" : "sm"}
            aria-label={t("common.language")}
            className="text-muted-foreground"
          />
        }
      >
        <Globe2 />
        {!compact && <span>{language.toUpperCase()}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
        {languages.map((item) => (
          <DropdownMenuItem key={item.code} onClick={() => void changeLanguage(item.code)}>
            <span className="w-5 text-[10px] font-semibold text-muted-foreground">{item.shortLabel}</span>
            <span className="flex-1">{item.label}</span>
            {language === item.code && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
