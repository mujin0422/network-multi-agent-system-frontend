import { useState } from "react"
import {
  FeatureFormSheet,
  FormField,
  type FormMode,
} from "@/components/common/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { MOCK_ACTIONS, MOCK_FUNCTIONS, MOCK_PERMISSIONS } from "../data"
import type { Role } from "../types"

/** Điều phối form tạo, xem và chỉnh sửa vai trò cùng các quyền được cấp. */
export function AccessControlForm({
  open,
  mode,
  role,
  grants,
  onOpenChange,
  onModeChange,
  onToggle,
}: {
  open: boolean
  mode: FormMode
  role: Role | null
  grants: Set<string>
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
  onToggle: (functionId: string, actionId: string) => void
}) {
  return (
    <AccessControlFormFields
      key={`${role?.id ?? "new"}-${open}`}
      open={open}
      mode={mode}
      role={role}
      grants={grants}
      onOpenChange={onOpenChange}
      onModeChange={onModeChange}
      onToggle={onToggle}
    />
  )
}

/** Quản lý bản nháp quyền và render các trường nhập của role form. */
function AccessControlFormFields({
  open,
  mode,
  role,
  grants,
  onOpenChange,
  onModeChange,
  onToggle,
}: {
  open: boolean
  mode: FormMode
  role: Role | null
  grants: Set<string>
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
  onToggle: (functionId: string, actionId: string) => void
}) {
  const readOnly = mode === "view"
  const [draftGrants, setDraftGrants] = useState(grants)
  const togglePermission = (
    functionId: string,
    actionId: string,
    permissionId: string,
  ) => {
    setDraftGrants((current) => {
      const next = new Set(current)
      if (next.has(permissionId)) next.delete(permissionId)
      else next.add(permissionId)
      return next
    })
    if (role) onToggle(functionId, actionId)
  }
  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel="role"
      description="Define the role and its function/action permissions in one form."
      canEdit={!!role && role.id !== "role-0001"}
      onEdit={() => onModeChange("edit")}
      onSubmit={() => onOpenChange(false)}
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
      <div>
        <p className="mb-2 text-xs font-medium">Permissions</p>
        <div className="space-y-2">
          {MOCK_FUNCTIONS.map((fn) => (
            <div key={fn.id} className="rounded-lg border p-3">
              <p className="text-xs font-medium">{fn.name}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {MOCK_ACTIONS.map((action) => {
                  const permission = MOCK_PERMISSIONS.find(
                    (item) =>
                      item.function_id === fn.id &&
                      item.action_id === action.id,
                  )!
                  return (
                    <label
                      key={action.id}
                      className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground"
                    >
                      <span>{action.name}</span>
                      <Switch
                        size="sm"
                        checked={draftGrants.has(permission.id)}
                        disabled={readOnly}
                        onCheckedChange={() =>
                          togglePermission(fn.id, action.id, permission.id)
                        }
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureFormSheet>
  )
}
