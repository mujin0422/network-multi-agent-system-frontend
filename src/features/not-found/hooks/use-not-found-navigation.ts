import { useNavigate } from "react-router-dom"
import { FALLBACK_PATH } from "../mocks/not-found.mock"
import { normalizeFallbackPath } from "../utils/not-found.util"

// Cung cấp thao tác điều hướng cho trang không tìm thấy.
export function useNotFoundNavigation() {
  const navigate = useNavigate()

  // Điều hướng người dùng về đường dẫn mặc định của ứng dụng.
  function goHome() {
    navigate(normalizeFallbackPath(FALLBACK_PATH))
  }

  return { goHome }
}
