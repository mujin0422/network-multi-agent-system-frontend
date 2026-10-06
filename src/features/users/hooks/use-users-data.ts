import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_ROLES, MOCK_USERS } from "../data"
import type { Role, User, UserStatus } from "../types"

// Quản lý tìm kiếm, trạng thái và phân trang danh sách người dùng.
export function useUsersData() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL")

  // Lọc danh sách người dùng theo từ khóa và trạng thái hiện tại.
  const rows = useMemo(function filterRows() {
    // Kiểm tra người dùng có khớp từ khóa và trạng thái đang chọn hay không.
    function matchesFilters(user: User) {
      const matchQuery = [user.id, user.full_name, user.email, user.status]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
      return matchQuery && (status === "ALL" || user.status === status)
    }

    return MOCK_USERS.filter(matchesFilters)
  }, [query, status])
  const pagination = useDataPagination(rows)

  // Trả về tên vai trò theo mã, hoặc chính mã đó nếu không tìm thấy.
  function roleName(id: string) {
    // Kiểm tra vai trò có mã trùng với mã cần tìm hay không.
    function matchesRole(role: Role) {
      return role.id === id
    }

    return MOCK_ROLES.find(matchesRole)?.name ?? id
  }
  return {
    query,
    rows: pagination.pageRows,
    pagination,
    status,
    setQuery,
    setStatus,
    roleName,
  }
}
