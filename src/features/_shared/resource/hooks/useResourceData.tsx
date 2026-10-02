import { useMemo, useState } from "react"

import type { ResourceRow } from "../types"

export function useResourceData(source: ResourceRow[]) {
  const [query, setQuery] = useState("")
  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return source
    return source.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(normalizedQuery)))
  }, [query, source])

  return { query, rows, setQuery }
}
