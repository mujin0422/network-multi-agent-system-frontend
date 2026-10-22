import { useState } from "react"
import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import type { FormMode } from "@/types/components"
import type { Brand, Category, DeviceCreate } from "@/service"
import type { Device } from "../types/device.type"

function DeviceFormFields({
  device,
  readOnly,
  brands,
  categories,
}: {
  device: Device | null
  readOnly: boolean
  brands: Brand[]
  categories: Category[]
}) {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(
    device?.brand_id ?? null,
  )
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(
    device?.device_type ?? null,
  )
  const selectedBrand = brands.find(
    (brand) => brand.id === selectedBrandId,
  )
  const deviceTypeOptions = (selectedBrand?.supported_drivers ?? []).map(
    (driver) => ({ value: driver, label: driver }),
  )

  function handleBrandChange(brandId: string | null) {
    const supportedDrivers =
      brands.find((brand) => brand.id === brandId)
        ?.supported_drivers ?? []
    setSelectedBrandId(brandId)
    setSelectedDeviceType((currentDeviceType) =>
      currentDeviceType && supportedDrivers.includes(currentDeviceType)
        ? currentDeviceType
        : null,
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Hostname" required>
          <Input
            name="hostname"
            defaultValue={device?.hostname}
            disabled={readOnly}
            placeholder="P1-CORE-HCM"
          />
        </FormField>
        <FormField label="Category" required>
          <FormCombobox
            name="category_id"
            defaultValue={device?.category_id ?? categories[0]?.id}
            disabled={readOnly}
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-[1fr_112px] gap-4">
        <FormField label="Host" required>
          <Input
            name="host"
            defaultValue={device?.host ?? "127.0.0.1"}
            disabled={readOnly}
          />
        </FormField>
        <FormField label="Port" required>
          <Input
            name="port"
            type="number"
            defaultValue={device?.port ?? 22}
            disabled={readOnly}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Brand" required>
          <FormCombobox
            name="brand_id"
            value={selectedBrandId}
            onValueChange={handleBrandChange}
            disabled={readOnly}
            options={brands.map((brand) => ({ value: brand.id, label: brand.name }))}
            placeholder="Select a brand"
          />
        </FormField>
        <FormField
          label="Device type"
          required
          hint={
            selectedBrand
              ? `Supported by ${selectedBrand.name}`
              : "Select a brand first."
          }
        >
          <FormCombobox
            name="device_type"
            value={selectedDeviceType}
            onValueChange={setSelectedDeviceType}
            disabled={readOnly || !selectedBrand}
            options={deviceTypeOptions}
            placeholder={
              selectedBrand
                ? "Select a supported driver"
                : "Select a brand first"
            }
          />
        </FormField>
      </div>
      <FormField
        label="Credential ID"
        hint="Optional; credential secrets remain encrypted."
      >
        <Input
          name="credential_id"
          defaultValue={device?.credential_id ?? ""}
          disabled={readOnly}
          placeholder="cred-ddmmyy-xxxx"
        />
      </FormField>
      <FormField label="Location">
        <Input
          name="location"
          defaultValue={device?.location ?? ""}
          disabled={readOnly}
          placeholder="Datacenter · Rack"
        />
      </FormField>
      {device && (
        <div className="rounded-lg border bg-muted/30 p-3 type-caption text-muted-foreground">
          <p>
            ID: <span className="font-mono">{device.id}</span>
          </p>
          <p className="mt-1">
            Created by: <span className="font-mono">{device.created_by}</span>
          </p>
          <p className="mt-1">
            Last updated by:{" "}
            <span className="font-mono">{device.last_updated_by}</span>
          </p>
          <p className="mt-1">
            Updated: {new Date(device.last_updated_at).toLocaleString("vi-VN")}
          </p>
        </div>
      )}
    </>
  )
}

/** Sheet tạo mới, xem hoặc cập nhật cấu hình kết nối của thiết bị. */
export function DeviceForm({
  open,
  mode,
  device,
  onOpenChange,
  onModeChange,
  brands,
  categories,
  onSave,
}: {
  open: boolean
  mode: FormMode
  device: Device | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
  brands: Brand[]
  categories: Category[]
  onSave: (payload: Omit<DeviceCreate, "last_updated_by">) => Promise<void>
}) {
  const readOnly = mode === "view"

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel="device"
      description="Select a brand to load only the Netmiko drivers supported by that vendor."
      canEdit={!!device}
      onEdit={() => onModeChange("edit")}
      onSubmit={async (data) => {
        const credentialId = String(data.get("credential_id") ?? "").trim()
        await onSave({
          hostname: String(data.get("hostname") ?? ""),
          category_id: String(data.get("category_id") ?? ""),
          host: String(data.get("host") ?? "127.0.0.1"),
          port: Number(data.get("port") ?? 22),
          brand_id: String(data.get("brand_id") ?? ""),
          device_type: String(data.get("device_type") ?? ""),
          credential_id: credentialId || null,
          location: String(data.get("location") ?? "").trim() || null,
        })
        onOpenChange(false)
      }}
    >
      <DeviceFormFields
        key={`${open}-${mode}-${device?.id ?? "new"}`}
        device={device}
        readOnly={readOnly}
        brands={brands}
        categories={categories}
      />
    </FeatureFormSheet>
  )
}
