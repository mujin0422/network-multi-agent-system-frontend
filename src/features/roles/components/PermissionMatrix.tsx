import type { DataTableColumn } from "@/types/shared/data-table.types"
import {
  DataTable,
  DataTableContent,
  DataTablePanel,
} from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
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
  hasChanges,
  onToggle,
  onSave,
}: {
  role: Role
  actions: Action[]
  functions: ManagementFunction[]
  permissions: Permission[]
  grants: Set<string>
  hasChanges: boolean
  onToggle: (functionId: string, actionId: string) => void
  onSave: () => void
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
          <p className="font-mono type-micro text-muted-foreground">{fn.id}</p>
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
    <DataTable
      data={functions}
      columns={columns}
      getRowId={(fn) => fn.id}
      initialPageSize={Math.max(functions.length, 1)}
    >
      <DataTablePanel>
        <div className="flex min-h-20 items-center justify-between gap-4 border-b px-4 py-5">
          <div className="space-y-1">
            <CardTitle className="text-sm">{role.name} permissions</CardTitle>
            <p className="type-caption text-muted-foreground">
              {role.id === "role-0001"
                ? "System role has full access and cannot be modified."
                : "Edit permissions directly, then save your changes."}
            </p>
          </div>
          {role.id !== "role-0001" && (
            <Button size="sm" disabled={!hasChanges} onClick={onSave}>
              Save changes
            </Button>
          )}
        </div>
        <DataTableContent />
      </DataTablePanel>
    </DataTable>
  )
}
