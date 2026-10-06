import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
  type FormMode,
} from "@/components/common/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { MOCK_BRANDS, MOCK_CATEGORIES } from "../data"
import type { Device } from "../types"

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
      description="Connection and inventory information defined by the Devices schema."
      canEdit={!!device}
      onEdit={() => onModeChange("edit")}
      onSubmit={() => onOpenChange(false)}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Hostname" required>
          <Input
            name="hostname"
            defaultValue={device?.hostname}
            disabled={readOnly}
            placeholder="P1-CORE-HCM"
          />
        </FormField>
        <FormField label="Device type" required>
          <Input
            name="device_type"
            defaultValue={device?.device_type ?? "cisco_ios_telnet"}
            disabled={readOnly}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-[1fr_110px] gap-4">
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
            defaultValue={device?.brand_id ?? MOCK_BRANDS[0].id}
            disabled={readOnly}
            options={MOCK_BRANDS.map((brand) => ({
              value: brand.id,
              label: brand.name,
            }))}
          />
        </FormField>
        <FormField label="Category" required>
          <FormCombobox
            name="category_id"
            defaultValue={device?.category_id ?? MOCK_CATEGORIES[0].id}
            disabled={readOnly}
            options={MOCK_CATEGORIES.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
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
        <div className="rounded-lg border bg-muted/30 p-3 text-[10px] text-muted-foreground">
          <p>
            ID: <span className="font-mono">{device.id}</span>
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
    </FeatureFormSheet>
  )
}
