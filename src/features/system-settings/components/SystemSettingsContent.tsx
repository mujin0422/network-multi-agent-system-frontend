import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useSystemSettingsData } from "../hooks/useSystemSettingsData"

export function SystemSettingsContent() {
  const { query, rows, setQuery } = useSystemSettingsData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
