import { useMemo } from "react"
import { MOCK_CREDENTIALS } from "../mocks/credentials.mock"

// Quản lý tìm kiếm và phân trang danh sách thông tin xác thực.
export function useCredentialsData() {
  const rows = MOCK_CREDENTIALS
  const summary = useMemo(() => ({
    total: MOCK_CREDENTIALS.length,
    assigned: MOCK_CREDENTIALS.filter((credential) => credential.device_count > 0).length,
    deviceAssignments: MOCK_CREDENTIALS.reduce((total, credential) => total + credential.device_count, 0),
    unassigned: MOCK_CREDENTIALS.filter((credential) => credential.device_count === 0).length,
  }), [])
  return { rows, summary }
}
