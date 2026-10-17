import { useMemo, useState } from "react"
import { MOCK_TASKS } from "../mocks/tasks.mock"
import { MOCK_OPERATIONS } from "../mocks/task-operations.mock"

// Quản lý tìm kiếm, trạng thái, lựa chọn và phân trang danh sách tác vụ.
export function useTasksData() {
  const [activeId, setActiveId] = useState(MOCK_TASKS[0].id)
  const rows = MOCK_TASKS
  const selected = MOCK_TASKS.find((task) => task.id === activeId) ?? MOCK_TASKS[0]
  const operations = MOCK_OPERATIONS.filter((operation) => operation.task_id === selected.id)
  const summary = useMemo(() => ({
    total: MOCK_TASKS.length,
    inProgress: MOCK_TASKS.filter((task) => ["PLANNING", "RUNNING"].includes(task.task_status)).length,
    completed: MOCK_TASKS.filter((task) => task.task_status === "SUCCESS").length,
    needsAttention: MOCK_TASKS.filter((task) => ["PARTIAL_SUCCESS", "FAILED", "REJECTED"].includes(task.task_status)).length,
  }), [])
  return {
    rows,
    activeId,
    setActiveId,
    selected,
    operations,
    summary,
  }
}
