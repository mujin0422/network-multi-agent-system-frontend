import { useState } from "react"

export const DEFAULT_PAGE_SIZE = 10

export function useDataPagination<T>(rows: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [requestedPage, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const page = Math.min(requestedPage, pageCount)
  const start = (page - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)

  return {
    pageRows,
    page,
    pageCount,
    pageSize,
    totalRows: rows.length,
    setPage,
  }
}
