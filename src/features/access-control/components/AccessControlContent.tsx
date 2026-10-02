import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useAccessControlData } from "../hooks/useAccessControlData"

export function AccessControlContent() {
  const { query, rows, setQuery } = useAccessControlData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
