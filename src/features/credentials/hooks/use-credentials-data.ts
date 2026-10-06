import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_CREDENTIALS } from "../data"
import type { Credential } from "../types"

// Quản lý tìm kiếm và phân trang danh sách thông tin xác thực.
export function useCredentialsData() {
  const [query, setQuery] = useState("")

  // Lọc danh sách thông tin xác thực theo từ khóa hiện tại.
  const rows = useMemo(function filterRows() {
    // Kiểm tra thông tin xác thực có chứa từ khóa tìm kiếm hay không.
    function matchesQuery(item: Credential) {
      return [item.id, item.username, item.encryption_type]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    }

    return MOCK_CREDENTIALS.filter(matchesQuery)
  }, [query])
  const pagination = useDataPagination(rows)
  return { query, rows: pagination.pageRows, pagination, setQuery }
}
