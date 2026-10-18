import { useState } from "react"
import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import type { FormMode } from "@/types/components"
import { MOCK_DEVICE_BRANDS } from "../mocks/device-brands.mock"
import { MOCK_DEVICE_CATEGORIES } from "../mocks/device-categories.mock"
import type { Device } from "../types/device.type"

const BRAND_OPTIONS = MOCK_DEVICE_BRANDS.map((brand) => ({
  value: brand.id,
  label: brand.name,
}))
const CATEGORY_OPTIONS = MOCK_DEVICE_CATEGORIES.map((category) => ({
  value: category.id,
  label: category.name,
}))

function DeviceFormFields({
  device,
  readOnly,
}: {
  device: Device | null
  readOnly: boolean
}) {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(
    device?.brand_id ?? null,
  )
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(
    device?.device_type ?? null,
  )
  const selectedBrand = MOCK_DEVICE_BRANDS.find(
    (brand) => brand.id === selectedBrandId,
  )
  const deviceTypeOptions = (selectedBrand?.supported_drivers ?? []).map(
    (driver) => ({ value: driver, label: driver }),
  )

  function handleBrandChange(brandId: string | null) {
    const supportedDrivers =
      MOCK_DEVICE_BRANDS.find((brand) => brand.id === brandId)
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
            defaultValue={device?.category_id ?? MOCK_DEVICE_CATEGORIES[0].id}
            disabled={readOnly}
            options={CATEGORY_OPTIONS}
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
            options={BRAND_OPTIONS}
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
}: {
  open: boolean
  mode: FormMode
  device: Device | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
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
      onSubmit={() => onOpenChange(false)}
    >
      <DeviceFormFields
        key={`${open}-${mode}-${device?.id ?? "new"}`}
        device={device}
        readOnly={readOnly}
      />
    </FeatureFormSheet>
  )
}
