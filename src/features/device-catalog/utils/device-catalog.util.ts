import type { Brand } from "../types/brand.type"
import type { CatalogEntity } from "../types/catalog-entity.type"
import type { CatalogRecord } from "../types/catalog-record.type"
import type { Category } from "../types/category.type"

export function isBrand(record: CatalogRecord): record is Brand {
  return "supported_drivers" in record
}

export function filterCatalogRecords<T extends CatalogRecord>(records: readonly T[], query: string): T[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return [...records]

  return records.filter((record) => {
    const searchable = isBrand(record)
      ? [record.id, record.name, ...record.supported_drivers]
      : [record.id, record.name, record.description ?? ""]
    return searchable.join(" ").toLowerCase().includes(normalizedQuery)
  })
}

export function entityLabel(entity: CatalogEntity, plural = false) {
  if (entity === "brand") return plural ? "brands" : "brand"
  return plural ? "categories" : "category"
}

export function catalogRecordCount(records: readonly Brand[] | readonly Category[]) {
  return records.reduce((total, record) => total + record.device_count, 0)
}
