import {
  FeatureFormSheet,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import type { FormMode } from "@/types/components"
import type { RoleCreate, RoleUpdate } from "@/service"
import type { Role } from "../types/role.type"

/** Điều phối form tạo, xem và chỉnh sửa vai trò cùng các quyền được cấp. */
export function AccessControlForm({
  open,
  mode,
  role,
  onOpenChange,
  onModeChange,
  onSave,
}: {
  open: boolean
  mode: FormMode
  role: Role | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
  onSave: (payload: RoleCreate | RoleUpdate) => Promise<void>
}) {
  return (
    <AccessControlFormFields
      key={`${role?.id ?? "new"}-${open}`}
      open={open}
      mode={mode}
      role={role}
      onOpenChange={onOpenChange}
      onModeChange={onModeChange}
      onSave={onSave}
    />
  )
}

/** Quản lý bản nháp quyền và render các trường nhập của role form. */
function AccessControlFormFields({
  open,
  mode,
  role,
  onOpenChange,
  onModeChange,
  onSave,
}: {
  open: boolean
  mode: FormMode
  role: Role | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
  onSave: (payload: RoleCreate | RoleUpdate) => Promise<void>
}) {
  const readOnly = mode === "view"
  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel="role"
      description="Create or update role metadata. Configure permissions directly in the matrix."
      canEdit={!!role && role.name.toLowerCase() !== "super admin"}
      onEdit={() => onModeChange("edit")}
      onSubmit={async (data) => {
        await onSave({ name: String(data.get("name") ?? "").trim() })
        onOpenChange(false)
      }}
    >
      <FormField label="Role name" required>
        <Input
          name="name"
          defaultValue={role?.name}
          disabled={readOnly}
          placeholder="Network Operator"
        />
      </FormField>
      {role && (
        <FormField label="Role ID">
          <Input value={role.id} disabled />
        </FormField>
      )}
    </FeatureFormSheet>
  )
}
