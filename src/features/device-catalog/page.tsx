import { useState } from "react"
import { DeviceCatalogNavigation } from "./components/DeviceCatalogNavigation"
import { DeviceCatalogTable } from "./components/DeviceCatalogTable"
import type { CatalogEntity } from "./types/catalog-entity.type"

export default function DeviceCatalogPage() {
  const [entity, setEntity] = useState<CatalogEntity>("brand")

  return (
    <div className="min-w-0 max-w-full overflow-x-clip px-12 sm:px-16">
      <DeviceCatalogNavigation entity={entity} onChange={setEntity}>
        <DeviceCatalogTable entity={entity} />
      </DeviceCatalogNavigation>
    </div>
  )
}
