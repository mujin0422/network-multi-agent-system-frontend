import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useTasksData } from "../hooks/useTasksData"

export function TasksContent() {
  const { query, rows, setQuery } = useTasksData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
