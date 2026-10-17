import { useMemo, useState } from "react"
import { MOCK_CATALOG_BRANDS } from "../mocks/catalog-brands.mock"
import { MOCK_CATALOG_CATEGORIES } from "../mocks/catalog-categories.mock"
import type { CatalogEntity } from "../types/catalog-entity.type"

/** Quản lý tab và tìm kiếm độc lập cho danh mục thiết bị. */
export function useDeviceCatalogData() {
  const [entity, setEntity] = useState<CatalogEntity>("brand")
  const brands = MOCK_CATALOG_BRANDS
  const categories = MOCK_CATALOG_CATEGORIES
  const summary = useMemo(() => ({
    brands: MOCK_CATALOG_BRANDS.length,
    categories: MOCK_CATALOG_CATEGORIES.length,
    drivers: new Set(MOCK_CATALOG_BRANDS.flatMap((brand) => brand.supported_drivers)).size,
    assignedDevices: MOCK_CATALOG_CATEGORIES.reduce((total, category) => total + category.device_count, 0),
  }), [])

  function selectEntity(nextEntity: CatalogEntity) {
    setEntity(nextEntity)
  }

  return { entity, brands, categories, summary, selectEntity }
}
