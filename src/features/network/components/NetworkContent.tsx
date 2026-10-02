import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useNetworkData } from "../hooks/useNetworkData"

export function NetworkContent() {
  const { query, rows, setQuery } = useNetworkData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
