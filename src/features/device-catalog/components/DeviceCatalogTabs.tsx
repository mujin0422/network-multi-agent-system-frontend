import { Boxes, Tags } from "lucide-react"
import { cn } from "@/lib/utils"
import { DEVICE_CATALOG_TABS } from "../constants/device-catalog.constants"
import type { CatalogEntity } from "../types/catalog-entity.type"

export function DeviceCatalogTabs({
  entity,
  onChange,
}: {
  entity: CatalogEntity
  onChange: (entity: CatalogEntity) => void
}) {
  return (
    <div className="grid border-b sm:grid-cols-2">
      {DEVICE_CATALOG_TABS.map((tab) => {
        const active = entity === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40",
              active &&
                "bg-blue-500/8 shadow-[inset_0_-2px_0_0_var(--color-blue-400)]",
            )}
          >
            <div
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground",
                active && "bg-blue-500/15 text-blue-400",
              )}
            >
              {tab.value === "brand" ? (
                <Tags className="size-4" />
              ) : (
                <Boxes className="size-4" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold">{tab.label}</p>
              <p className="mt-1 type-caption text-muted-foreground">
                {tab.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
