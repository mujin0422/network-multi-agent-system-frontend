import { useState } from "react"

import type { CatalogEntity } from "../types/catalog-entity.type"

/** Quản lý loại dữ liệu đang được hiển thị trong Device Catalog. */
export function useDeviceCatalogView() {
  const [entity, setEntity] = useState<CatalogEntity>("brand")
  return { entity, setEntity }
}
