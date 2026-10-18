import { useState } from "react"
import type { FormMode } from "@/types/components"
import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
} from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { MoreMenu } from "@/components/shared/MoreMenu"
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import {
  USER_STATUS_LABELS,
  USER_STATUS_OPTIONS,
} from "../constants/users.constants"
import { useUsersData } from "../hooks/use-users-data"
import type { User } from "../types/user.type"
import { UserForm } from "./UserForm"
import { UserStats } from "./UserStats"

/** Màn hình quản lý người dùng, vai trò và trạng thái tài khoản. */
export function UsersTable() {
  const { rows, summary, roleName } = useUsersData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    user: User | null
  }>({ open: false, mode: "create", user: null })
  const openForm = (mode: FormMode, user: User | null = null) =>
    setForm({ open: true, mode, user })
  const headerAction = (
    <Button size="sm" onClick={() => openForm("create")}>
      Invite user
    </Button>
  )
  return (
    <>
      <PageLayout>
        <PageLayoutHeader
          title="Users"
          description="Manage user identities, assigned roles, and account access."
        >
          {headerAction}
        </PageLayoutHeader>
        <UserStats summary={summary} />
        <PageLayoutContent>
          <DataTable
            data={rows}
            getRowId={(user) => user.id}
            filters={[
              {
                id: "status",
                label: "status",
                accessorKey: "user_status",
                allLabel: "All statuses",
                options: USER_STATUS_OPTIONS,
              },
            ]}
            searchValue={(user) =>
              `${user.full_name} ${user.email} ${user.id} ${roleName(user.role_id)}`
            }
            columns={[
              {
                id: "user",
                header: "User",
                headerClassName: "pl-4",
                className: "pl-4",
                cell: (user) => (
                  <div>
                    <p className="text-xs font-medium">{user.full_name}</p>
                    <p className="type-caption text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="font-mono type-micro text-muted-foreground/70">
                      {user.id}
                    </p>
                  </div>
                ),
              },
              {
                id: "role",
                header: "Role",
                cell: (user) => (
                  <span className="rounded-md bg-muted px-2 py-1 type-caption">
                    {roleName(user.role_id)}
                  </span>
                ),
              },
              {
                id: "status",
                header: "Status",
                cell: (user) => (
                  <StatusBadge
                    value={user.user_status}
                    label={USER_STATUS_LABELS[user.user_status]}
                  />
                ),
              },
              {
                id: "last-login",
                header: "Last login",
                className: "type-caption text-muted-foreground",
                cell: (user) =>
                  user.last_login_at
                    ? new Date(user.last_login_at).toLocaleString("vi-VN")
                    : "Never",
              },
              {
                id: "created",
                header: "Created",
                className: "type-caption text-muted-foreground",
                cell: (user) =>
                  new Date(user.created_at).toLocaleDateString("vi-VN"),
              },
              {
                id: "actions",
                header: null,
                cell: (user) => (
                  <MoreMenu
                    onView={() => openForm("view", user)}
                    onEdit={() => openForm("edit", user)}
                    onCopy={() => navigator.clipboard?.writeText(user.id)}
                  />
                ),
              },
            ]}
          >
            <DataTablePanel>
              <DataTableToolbar>
                <DataTableSearch placeholder="Search name, email, ID..." />
                <DataTableToolbarActions>
                  <DataTableFilters />
                </DataTableToolbarActions>
              </DataTableToolbar>
              <DataTableContent />
              <DataTablePagination itemLabel="users" />
            </DataTablePanel>
          </DataTable>
        </PageLayoutContent>
      </PageLayout>
      <UserForm
        open={form.open}
        mode={form.mode}
        user={form.user}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
        onModeChange={(mode) => setForm((current) => ({ ...current, mode }))}
      />
    </>
  )
}
