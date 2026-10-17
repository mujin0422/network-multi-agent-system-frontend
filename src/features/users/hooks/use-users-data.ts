import { useMemo } from "react"
import { MOCK_USER_ROLES } from "../mocks/user-roles.mock"
import { MOCK_USERS } from "../mocks/users.mock"
import { roleName as resolveRoleName } from "../utils/users.util"

// Quản lý tìm kiếm, trạng thái và phân trang danh sách người dùng.
export function useUsersData() {
  const rows = MOCK_USERS

  // Trả về tên vai trò theo mã, hoặc chính mã đó nếu không tìm thấy.
  function roleName(id: string) {
    // Kiểm tra vai trò có mã trùng với mã cần tìm hay không.
    return resolveRoleName(MOCK_USER_ROLES, id)
  }
  const summary = useMemo(() => ({
    total: MOCK_USERS.length,
    active: MOCK_USERS.filter((user) => user.user_status === "ACTIVE").length,
    rolesAssigned: new Set(MOCK_USERS.map((user) => user.role_id)).size,
    loggedIn: MOCK_USERS.filter((user) => Boolean(user.last_login_at)).length,
  }), [])
  return {
    rows,
    roleName,
    summary,
  }
}
