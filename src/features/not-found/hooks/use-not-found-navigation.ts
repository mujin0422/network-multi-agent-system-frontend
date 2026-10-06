import { useNavigate } from "react-router-dom"
import { FALLBACK_PATH } from "../data"

// Cung cấp thao tác điều hướng cho trang không tìm thấy.
export function useNotFoundNavigation() {
  const navigate = useNavigate()

  // Điều hướng người dùng về đường dẫn mặc định của ứng dụng.
  function goHome() {
    navigate(FALLBACK_PATH)
  }

  return { goHome }
}
