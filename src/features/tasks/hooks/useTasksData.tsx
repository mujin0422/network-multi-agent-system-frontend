import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_TASKS } from "../data"
import type { TaskStatus } from "../types"

export function useTasksData() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL")
  const [activeId, setActiveId] = useState(MOCK_TASKS[0].id)
  const rows = useMemo(
    () =>
      MOCK_TASKS.filter((task) => {
        const matchQuery = [
          task.id,
          task.input_message,
          task.status,
          task.user_id,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
        return matchQuery && (status === "ALL" || task.status === status)
      }),
    [query, status],
  )
  const pagination = useDataPagination(rows)
  return {
    query,
    rows: pagination.pageRows,
    pagination,
    status,
    activeId,
    setQuery,
    setStatus,
    setActiveId,
  }
}
