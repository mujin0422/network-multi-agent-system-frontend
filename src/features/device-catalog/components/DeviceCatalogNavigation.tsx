import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEVICE_CATALOG_TABS } from "../constants/device-catalog.constants"
import type { CatalogEntity } from "../types/catalog-entity.type"

export function DeviceCatalogNavigation({
  entity,
  onChange,
  children,
}: {
  entity: CatalogEntity
  onChange: (entity: CatalogEntity) => void
  children: ReactNode
}) {
  const targetEntity: CatalogEntity = entity === "brand" ? "category" : "brand"
  const targetLabel =
    DEVICE_CATALOG_TABS.find((tab) => tab.value === targetEntity)?.label ??
    targetEntity

  return (
    <div className="relative min-w-0">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onChange(targetEntity)}
        aria-label={`Previous catalog: ${targetLabel}`}
        title={`Show ${targetLabel}`}
        className="absolute top-1/2 -left-12 z-10 -translate-y-1/2 rounded-full sm:-left-16"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="min-w-0">{children}</div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onChange(targetEntity)}
        aria-label={`Next catalog: ${targetLabel}`}
        title={`Show ${targetLabel}`}
        className="absolute top-1/2 -right-12 z-10 -translate-y-1/2 rounded-full sm:-right-16"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
