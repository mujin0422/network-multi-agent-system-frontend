import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_CREDENTIALS } from "../data"

export function useCredentialsData() {
  const [query, setQuery] = useState("")
  const rows = useMemo(() => MOCK_CREDENTIALS.filter((item) => [item.id, item.username, item.encryption_type].join(" ").toLowerCase().includes(query.toLowerCase())), [query])
  const pagination = useDataPagination(rows)
  return { query, rows: pagination.pageRows, pagination, setQuery }
}
