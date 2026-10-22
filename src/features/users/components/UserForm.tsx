import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import type { FormMode } from "@/types/components"
import type { Role, UserCreate, UserUpdate } from "@/service"
import { USER_STATUS_OPTIONS } from "../constants/users.constants"
import type { User } from "../types/user.type"

/** Sheet tạo mới, xem hoặc chỉnh sửa tài khoản và vai trò người dùng. */
export function UserForm({
  open,
  mode,
  user,
  onOpenChange,
  onModeChange,
  roles,
  onSave,
}: {
  open: boolean
  mode: FormMode
  user: User | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
  roles: Role[]
  onSave: (payload: UserCreate | UserUpdate) => Promise<void>
}) {
  const readOnly = mode === "view"
  const roleOptions = roles.map((role) => ({ value: role.id, label: role.name }))
  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel="user"
      description="Identity, role assignment, and account status."
      canEdit={!!user}
      onEdit={() => onModeChange("edit")}
      onSubmit={async (data) => {
        const payload: UserCreate | UserUpdate = {
          full_name: String(data.get("full_name") ?? ""),
          email: String(data.get("email") ?? ""),
          role_id: String(data.get("role_id") ?? ""),
          user_status: String(data.get("user_status") ?? "ACTIVE") as UserCreate["user_status"],
          ...(mode === "create" ? { password: String(data.get("password") ?? "") } : {}),
        }
        await onSave(payload)
        onOpenChange(false)
      }}
    >
      <FormField label="Full name" required>
        <Input
          name="full_name"
          defaultValue={user?.full_name}
          disabled={readOnly}
        />
      </FormField>
      <FormField label="Email" required>
        <Input
          name="email"
          type="email"
          defaultValue={user?.email}
          disabled={readOnly}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Role" required>
          <FormCombobox
            name="role_id"
            defaultValue={user?.role_id ?? roles[0]?.id}
            disabled={readOnly}
            options={roleOptions}
          />
        </FormField>
        <FormField label="Status" required>
          <FormCombobox
            name="user_status"
            defaultValue={user?.user_status ?? "ACTIVE"}
            disabled={readOnly}
            options={USER_STATUS_OPTIONS}
          />
        </FormField>
      </div>
      {mode === "create" && (
        <FormField
          label="Temporary password"
          required
          hint="The user will be asked to change it on first login."
        >
          <Input name="password" type="password" autoComplete="new-password" />
        </FormField>
      )}
      {user && (
        <div className="rounded-lg border bg-muted/30 p-3 type-caption text-muted-foreground">
          <p>
            ID: <span className="font-mono">{user.id}</span>
          </p>
          <p className="mt-1">
            Created: {new Date(user.created_at).toLocaleString("vi-VN")}
          </p>
          <p className="mt-1">
            Last login:{" "}
            {user.last_login_at
              ? new Date(user.last_login_at).toLocaleString("vi-VN")
              : "Never"}
          </p>
        </div>
      )}
    </FeatureFormSheet>
  )
}
