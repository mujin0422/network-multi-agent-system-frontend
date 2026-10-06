import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_TASKS } from "../data"
import type { Task, TaskStatus } from "../types"

// Quản lý tìm kiếm, trạng thái, lựa chọn và phân trang danh sách tác vụ.
export function useTasksData() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL")
  const [activeId, setActiveId] = useState(MOCK_TASKS[0].id)

  // Lọc danh sách tác vụ theo từ khóa và trạng thái hiện tại.
  const rows = useMemo(function filterRows() {
    // Kiểm tra tác vụ có khớp từ khóa và trạng thái đang chọn hay không.
    function matchesFilters(task: Task) {
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
    }

    return MOCK_TASKS.filter(matchesFilters)
  }, [query, status])
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
