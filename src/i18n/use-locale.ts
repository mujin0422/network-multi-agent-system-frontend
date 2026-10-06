import { useTranslation } from "react-i18next"

export function useLocale() {
  const { i18n } = useTranslation()
  const language: "en" | "vi" = i18n.resolvedLanguage === "en" ? "en" : "vi"
  const locale = language === "en" ? "en-US" : "vi-VN"

  return {
    language,
    locale,
    changeLanguage: (nextLanguage: "vi" | "en") => i18n.changeLanguage(nextLanguage),
    formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, options).format(new Date(value)),
  }
}
