import { useMemo, useState } from "react"

import type { ResourceRow } from "../types"

// Quản lý tìm kiếm trên danh sách tài nguyên dùng chung.
export function useResourceData(source: ResourceRow[]) {
  const [query, setQuery] = useState("")

  // Lọc danh sách tài nguyên theo từ khóa đã nhập.
  const rows = useMemo(function filterRows() {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return source

    // Kiểm tra một tài nguyên có bất kỳ trường nào chứa từ khóa hay không.
    function matchesQuery(row: ResourceRow) {
      // Kiểm tra một giá trị văn bản có chứa từ khóa đã chuẩn hóa hay không.
      function includesQuery(value: string) {
        return value.toLowerCase().includes(normalizedQuery)
      }

      return Object.values(row).some(includesQuery)
    }

    return source.filter(matchesQuery)
  }, [query, source])

  return { query, rows, setQuery }
}
