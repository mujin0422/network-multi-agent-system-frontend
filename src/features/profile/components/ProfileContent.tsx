import { ResourcePage } from "@/features/_shared/resource/components/ResourcePage"
import { MODULE_CONFIG } from "../constants"
import { useProfileData } from "../hooks/useProfileData"

export function ProfileContent() {
  const { query, rows, setQuery } = useProfileData()
  return <ResourcePage config={MODULE_CONFIG} query={query} rows={rows} onQueryChange={setQuery} />
}
