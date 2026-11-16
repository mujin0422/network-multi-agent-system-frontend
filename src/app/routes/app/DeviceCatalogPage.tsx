import { DeviceCatalogNavigation } from "@/features/device-catalog/components/DeviceCatalogNavigation"
import { DeviceCatalogTable } from "@/features/device-catalog/components/DeviceCatalogTable"
import { useDeviceCatalogView } from "@/features/device-catalog/hooks/use-device-catalog-view"

export default function DeviceCatalogPage() {
  const { entity, setEntity } = useDeviceCatalogView()

  return (
    <div className="min-w-0 max-w-full overflow-x-clip px-12 sm:px-16">
      <DeviceCatalogNavigation entity={entity} onChange={setEntity}>
        <DeviceCatalogTable entity={entity} />
      </DeviceCatalogNavigation>
    </div>
  )
}
