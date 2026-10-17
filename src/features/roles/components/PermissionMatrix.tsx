import { Eye, Pencil } from "lucide-react"
import type { DataTableColumn } from "@/types/shared/data-table.types"
import {
  DataTable,
  DataTableContent,
  DataTablePanel,
  DataTablePagination,
} from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { Action } from "../types/action.type"
import type { ManagementFunction } from "../types/management-function.type"
import type { Permission } from "../types/permission.type"
import type { Role } from "../types/role.type"

export function PermissionMatrix({
  role,
  actions,
  functions,
  permissions,
  grants,
  onToggle,
  onViewRole,
  onEditRole,
}: {
  role: Role
  actions: Action[]
  functions: ManagementFunction[]
  permissions: Permission[]
  grants: Set<string>
  onToggle: (functionId: string, actionId: string) => void
  onViewRole: () => void
  onEditRole: () => void
}) {
  const columns: DataTableColumn<ManagementFunction>[] = [
    {
      id: "function",
      header: "Management function",
      headerClassName: "pl-4",
      className: "pl-4",
      cell: (fn) => (
        <>
          <p className="text-xs font-medium">{fn.name}</p>
          <p className="font-mono text-[8px] text-muted-foreground">{fn.id}</p>
        </>
      ),
    },
    ...actions.map(
      (action): DataTableColumn<ManagementFunction> => ({
        id: action.id,
        header: action.name,
        headerClassName: "text-center",
        className: "text-center",
        cell: (fn) => {
          const permission = permissions.find(
            (item) =>
              item.function_id === fn.id && item.action_id === action.id,
          )!
          return (
            <Switch
              size="sm"
              checked={grants.has(permission.id)}
              disabled={role.id === "role-0001"}
              onCheckedChange={() => onToggle(fn.id, action.id)}
              aria-label={`${fn.name} ${action.name}`}
            />
          )
        },
      }),
    ),
  ]
  return (
    <DataTable data={functions} columns={columns} getRowId={(fn) => fn.id}>
      <DataTablePanel>
        <CardHeader className="border-b py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-sm">{role.name} permissions</CardTitle>
              <p className="text-[10px] text-muted-foreground">
                {role.id === "role-0001"
                  ? "System role has full access and cannot be modified."
                  : "Changes in this prototype apply immediately."}
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="icon-xs" variant="ghost" onClick={onViewRole}>
                <Eye />
              </Button>
              {role.id !== "role-0001" && (
                <Button size="icon-xs" variant="ghost" onClick={onEditRole}>
                  <Pencil />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <DataTableContent />
        <DataTablePagination itemLabel="functions" />
      </DataTablePanel>
    </DataTable>
  )
}
