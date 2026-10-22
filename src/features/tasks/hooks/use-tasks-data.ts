import { useCallback, useEffect, useMemo, useState } from "react"
import { tasksApi } from "@/service"
import type { TaskOperation } from "../types/task-operation.type"
import type { Task } from "../types/task.type"

export function useTasksData() {
  const [rows, setRows] = useState<Task[]>([])
  const [activeId, setActiveId] = useState("")
  const [operations, setOperations] = useState<TaskOperation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reload = useCallback(async () => {
    try {
      const tasks = await tasksApi.list()
      setRows(tasks)
      setActiveId((current) => current && tasks.some((task) => task.id === current) ? current : tasks[0]?.id ?? "")
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải task") }
    finally { setLoading(false) }
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reload() }, [reload])
  useEffect(() => {
    if (!activeId) return
    void tasksApi.get(activeId).then((task) => setOperations(task.operations as TaskOperation[])).catch((reason) => setError(reason instanceof Error ? reason.message : "Không thể tải operation"))
  }, [activeId])
  const selected = rows.find((task) => task.id === activeId) ?? rows[0] ?? null
  const summary = useMemo(() => ({
    total: rows.length,
    inProgress: rows.filter((task) => ["PLANNING", "RUNNING"].includes(task.task_status)).length,
    completed: rows.filter((task) => task.task_status === "SUCCESS").length,
    needsAttention: rows.filter((task) => ["PARTIAL_SUCCESS", "FAILED", "REJECTED"].includes(task.task_status)).length,
  }), [rows])
  return { rows, activeId, setActiveId, selected, operations, summary, loading, error, reload }
}
