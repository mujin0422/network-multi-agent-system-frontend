import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import en from "./locales/en"
import vi from "./locales/vi"

export const supportedLanguages = ["en", "vi"] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    supportedLngs: supportedLanguages,
    fallbackLng: "en",
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "app-language",
    },
    react: { useSuspense: false },
  })

const syncDocumentLanguage = (language: string) => {
  document.documentElement.lang = language.split("-")[0]
}

syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language)
i18n.on("languageChanged", syncDocumentLanguage)

export default i18n
