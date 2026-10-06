import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_ROLES, MOCK_USERS } from "../data"
import type { UserStatus } from "../types"

export function useUsersData() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL")
  const rows = useMemo(
    () =>
      MOCK_USERS.filter((user) => {
        const matchQuery = [user.id, user.full_name, user.email, user.status]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
        return matchQuery && (status === "ALL" || user.status === status)
      }),
    [query, status],
  )
  const pagination = useDataPagination(rows)
  const roleName = (id: string) =>
    MOCK_ROLES.find((role) => role.id === id)?.name ?? id
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
