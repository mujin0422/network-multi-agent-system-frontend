import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/styles/globals.css"
import "@/i18n"
import { initializeAppearance } from "@/features/settings/hooks/use-system-settings-data"
import App from "@/app/App"

initializeAppearance()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
