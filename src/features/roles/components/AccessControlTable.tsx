import { useState } from "react"
import type { FormMode } from "@/types/components"
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { useAccessControlData } from "../hooks/use-access-control-data"
import type { Role } from "../types/role.type"
import { AccessControlForm } from "./AccessControlForm"
import { AccessControlStats } from "./AccessControlStats"
import { PermissionMatrix } from "./PermissionMatrix"
import { RoleSelector } from "./RoleSelector"

/** Màn hình quản lý vai trò và ma trận phân quyền theo chức năng. */
export function AccessControlTable() {
  const {
    activeRoleId,
    actions,
    functions,
    permissions,
    roles,
    roleGrants,
    hasChanges,
    selectRole,
    saveChanges,
    toggle,
  } = useAccessControlData()
  const activeRole = roles.find((role) => role.id === activeRoleId)!
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    role: Role | null
  }>({ open: false, mode: "create", role: null })
  const openForm = (mode: FormMode, role: Role | null = null) =>
    setForm({ open: true, mode, role })
  const headerAction = (
    <Button size="sm" onClick={() => openForm("create")}>
      Create role
    </Button>
  )
  return (
    <>
      <PageLayout>
        <PageLayoutHeader
          title="Access Control"
          description="Role-based permissions across every management function."
        >
          {headerAction}
        </PageLayoutHeader>
        <AccessControlStats
          roles={roles.length}
          permissions={permissions.length}
          functions={functions.length}
        />
        <PageLayoutContent className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <RoleSelector
            roles={roles}
            activeRoleId={activeRoleId}
            onSelect={selectRole}
          />
          <PermissionMatrix
            role={activeRole}
            actions={actions}
            functions={functions}
            permissions={permissions}
            grants={roleGrants}
            hasChanges={hasChanges}
            onToggle={toggle}
            onSave={saveChanges}
          />
        </PageLayoutContent>
      </PageLayout>
      <AccessControlForm
        open={form.open}
        mode={form.mode}
        role={form.role}
        grants={roleGrants}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
        onModeChange={(mode) => setForm((current) => ({ ...current, mode }))}
        onToggle={toggle}
      />
    </>
  )
}
