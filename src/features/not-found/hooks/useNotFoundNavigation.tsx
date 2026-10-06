import { useNavigate } from "react-router-dom"
import { FALLBACK_PATH } from "../data"

export function useNotFoundNavigation() {
  const navigate = useNavigate()
  return { goHome: () => navigate(FALLBACK_PATH) }
}
