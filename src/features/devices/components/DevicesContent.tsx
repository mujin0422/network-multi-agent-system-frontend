import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useDevicesData } from "../hooks/useDevicesData"

export function DevicesContent() {
  const { query, rows, setQuery } = useDevicesData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
