import type { CatalogEntity } from "../types/catalog-entity.type"

export const DEVICE_CATALOG_TABS: ReadonlyArray<{ value: CatalogEntity; label: string; description: string }> = [
  { value: "brand", label: "Brands", description: "Vendors and their supported Netmiko drivers" },
  { value: "category", label: "Categories", description: "Reusable device classifications" },
]

export const DRIVER_SEPARATOR = "\n"
