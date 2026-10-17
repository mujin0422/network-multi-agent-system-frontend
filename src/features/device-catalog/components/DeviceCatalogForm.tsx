import {
  FeatureFormSheet,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FormMode } from "@/types/components"
import { DRIVER_SEPARATOR } from "../constants/device-catalog.constants"
import type { CatalogEntity } from "../types/catalog-entity.type"
import type { CatalogRecord } from "../types/catalog-record.type"
import { isBrand } from "../utils/device-catalog.util"

type DeviceCatalogFormProps = {
  open: boolean
  mode: FormMode
  entity: CatalogEntity
  record: CatalogRecord | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
}

/** Sheet dùng chung để tạo, xem và chỉnh sửa brand/category. */
export function DeviceCatalogForm({
  open,
  mode,
  entity,
  record,
  onOpenChange,
  onModeChange,
}: DeviceCatalogFormProps) {
  const readOnly = mode === "view"
  const brand = record && isBrand(record) ? record : null
  const category = record && !isBrand(record) ? record : null

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel={entity}
      description={
        entity === "brand"
          ? "Manage a vendor and the unique, non-empty Netmiko drivers it supports."
          : "Manage a reusable classification for inventory devices."
      }
      canEdit={Boolean(record)}
      onEdit={() => onModeChange("edit")}
      onSubmit={() => onOpenChange(false)}
    >
      <FormField label="Name" required>
        <Input
          name="name"
          defaultValue={record?.name ?? ""}
          disabled={readOnly}
          placeholder={entity === "brand" ? "Cisco" : "Router"}
        />
      </FormField>
      {entity === "brand" ? (
        <FormField
          label="Supported drivers"
          required
          hint="Enter one unique Netmiko driver per line."
        >
          <Textarea
            name="supported_drivers"
            defaultValue={brand?.supported_drivers.join(DRIVER_SEPARATOR) ?? ""}
            disabled={readOnly}
            rows={7}
            className="font-mono text-xs"
            placeholder={"cisco_ios\ncisco_nxos"}
          />
        </FormField>
      ) : (
        <FormField label="Description">
          <Textarea
            name="description"
            defaultValue={category?.description ?? ""}
            disabled={readOnly}
            rows={5}
            placeholder="Describe the devices grouped in this category."
          />
        </FormField>
      )}
      {record && (
        <div className="rounded-lg border bg-muted/30 p-3 text-[10px] text-muted-foreground">
          <p>
            ID: <span className="font-mono">{record.id}</span>
          </p>
          <p className="mt-1">Assigned devices: {record.device_count}</p>
        </div>
      )}
    </FeatureFormSheet>
  )
}
