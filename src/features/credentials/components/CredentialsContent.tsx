import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useCredentialsData } from "../hooks/useCredentialsData"

export function CredentialsContent() {
  const { query, rows, setQuery } = useCredentialsData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
