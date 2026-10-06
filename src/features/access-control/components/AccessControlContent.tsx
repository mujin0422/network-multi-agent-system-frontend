import { Check, Eye, LockKeyhole, Pencil, Plus, ShieldCheck, Users } from "lucide-react"
import { useState } from "react"
import type { FormMode } from "@/types/components"
import { DataPagination } from "@/components/common/DataPagination"
import { FeatureHeader, StatCard } from "@/components/common/FeatureShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_ACTIONS, MOCK_PERMISSIONS } from "../data"
import { useAccessControlData } from "../hooks/use-access-control-data"
import type { Role } from "../types"
import { AccessControlForm } from "./AccessControlForm"

/** Màn hình quản lý vai trò và ma trận phân quyền theo chức năng. */
export function AccessControlContent() {
  const { activeRoleId, functions, roles, roleGrants, setActiveRoleId, toggle } = useAccessControlData()
  const activeRole = roles.find((role) => role.id === activeRoleId)!
  const pagination = useDataPagination(functions)
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    role: Role | null
  }>({ open: false, mode: "create", role: null })
  const openForm = (mode: FormMode, role: Role | null = null) => setForm({ open: true, mode, role })
  const headerAction = (
    <Button size="sm" onClick={() => openForm("create")}>
      <Plus />
      Create role
    </Button>
  )
  return (
    <>
      <div className="space-y-5">
        <FeatureHeader title="Access Control" description="Role-based permissions across every management function." action={headerAction} />
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Roles" value={roles.length} detail="1 system-protected" icon={Users} />
          <StatCard label="Permissions" value={MOCK_PERMISSIONS.length} detail="Function + action pairs" icon={ShieldCheck} tone="green" />
          <StatCard label="Functions" value={functions.length} detail="Protected modules" icon={LockKeyhole} tone="violet" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Card className="gap-0 py-0">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm">Roles</CardTitle>
              <p className="text-[10px] text-muted-foreground">Select a role to configure</p>
            </CardHeader>
            <CardContent className="space-y-1 p-2">
              {roles.map((role) => (
                <button key={role.id} onClick={() => setActiveRoleId(role.id)} className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors", role.id === activeRoleId ? "bg-blue-500/10 text-blue-300" : "text-muted-foreground hover:bg-muted")}>
                  <div>
                    <p className="text-xs font-medium">{role.name}</p>
                    <p className="mt-0.5 font-mono text-[9px] opacity-60">{role.id}</p>
                  </div>
                  {role.id === activeRoleId && <Check className="size-3.5" />}
                </button>
              ))}
            </CardContent>
          </Card>
          <Card className="gap-0 py-0">
            <CardHeader className="border-b py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">{activeRole.name} permissions</CardTitle>
                  <p className="text-[10px] text-muted-foreground">{activeRoleId === "role-0001" ? "System role has full access and cannot be modified." : "Changes in this prototype apply immediately."}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon-xs" variant="ghost" onClick={() => openForm("view", activeRole)}>
                    <Eye />
                  </Button>
                  {activeRoleId !== "role-0001" && (
                    <Button size="icon-xs" variant="ghost" onClick={() => openForm("edit", activeRole)}>
                      <Pencil />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow className="text-[9px] uppercase text-muted-foreground">
                  <TableHead className="pl-4">Management function</TableHead>
                  {MOCK_ACTIONS.map((action) => (
                    <TableHead key={action.id} className="text-center">
                      {action.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.pageRows.map((fn) => (
                  <TableRow key={fn.id}>
                    <TableCell className="pl-4">
                      <p className="text-xs font-medium">{fn.name}</p>
                      <p className="font-mono text-[8px] text-muted-foreground">{fn.id}</p>
                    </TableCell>
                    {MOCK_ACTIONS.map((action) => {
                      const permission = MOCK_PERMISSIONS.find((item) => item.function_id === fn.id && item.action_id === action.id)!
                      return (
                        <TableCell key={action.id} className="text-center">
                          <Switch size="sm" checked={roleGrants.has(permission.id)} disabled={activeRoleId === "role-0001"} onCheckedChange={() => toggle(fn.id, action.id)} aria-label={`${fn.name} ${action.name}`} />
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DataPagination {...pagination} onPageChange={pagination.setPage} />
          </Card>
        </div>
      </div>
      <AccessControlForm open={form.open} mode={form.mode} role={form.role} grants={roleGrants} onOpenChange={(open) => setForm((current) => ({ ...current, open }))} onModeChange={(mode) => setForm((current) => ({ ...current, mode }))} onToggle={toggle} />
    </>
  )
}
