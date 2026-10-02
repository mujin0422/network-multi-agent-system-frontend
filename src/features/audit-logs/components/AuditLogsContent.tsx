import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useAuditLogsData } from "../hooks/useAuditLogsData"

export function AuditLogsContent() {
  const { query, rows, setQuery } = useAuditLogsData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
