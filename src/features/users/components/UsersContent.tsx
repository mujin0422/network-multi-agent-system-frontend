import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useUsersData } from "../hooks/useUsersData"

export function UsersContent() {
  const { query, rows, setQuery } = useUsersData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
