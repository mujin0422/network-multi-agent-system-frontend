import { CirclePlus, Clock3, ShieldCheck, UserCheck, Users } from "lucide-react"
import { useState } from "react"
import type { FormMode } from "@/types/components"
import { DataPagination } from "@/components/common/DataPagination"
import { FeatureHeader, FilterCombobox, StatCard, StatusBadge, TableToolbar } from "@/components/common/FeatureShell"
import { MoreMenu } from "@/components/common/MoreMenu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUsersData } from "../hooks/useUsersData"
import type { User } from "../types"
import { UserForm } from "./UserForm"

const USER_STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "DISABLED", label: "Disabled" },
] as const

/** Màn hình quản lý người dùng, vai trò và trạng thái tài khoản. */
export function UsersContent() {
  const { query, rows, pagination, status, setQuery, setStatus, roleName } = useUsersData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    user: User | null
  }>({ open: false, mode: "create", user: null })
  const openForm = (mode: FormMode, user: User | null = null) => setForm({ open: true, mode, user })
  const headerAction = (
    <Button size="sm" onClick={() => openForm("create")}>
      <CirclePlus />
      Invite user
    </Button>
  )
  return (
    <>
      <div className="space-y-5">
        <FeatureHeader title="Users" description="Manage user identities, assigned roles, and account access." action={headerAction} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" value="4" detail="4 platform identities" icon={Users} />
          <StatCard label="Active" value="3" detail="75% of all users" icon={UserCheck} tone="green" />
          <StatCard label="Roles assigned" value="4" detail="RBAC coverage" icon={ShieldCheck} tone="violet" />
          <StatCard label="Online today" value="3" detail="Last 24 hours" icon={Clock3} />
        </div>
        <Card className="gap-0 py-0">
          <TableToolbar query={query} onQueryChange={setQuery} placeholder="Search name, email, ID...">
            <FilterCombobox value={status} onValueChange={setStatus} ariaLabel="Filter by status" options={USER_STATUS_FILTER_OPTIONS} />
          </TableToolbar>
          <Table>
            <TableHeader>
              <TableRow className="text-[10px] uppercase text-muted-foreground">
                <TableHead className="pl-4">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-500/10 text-[10px] text-blue-400">
                          {user.full_name
                            .split(" ")
                            .slice(-2)
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{user.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">{user.email}</p>
                        <p className="font-mono text-[8px] text-muted-foreground/70">{user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-md bg-muted px-2 py-1 text-[10px]">{roleName(user.role_id)}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={user.status} />
                  </TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">{user.last_login_at ? new Date(user.last_login_at).toLocaleString("vi-VN") : "Never"}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">{new Date(user.created_at).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>
                    <MoreMenu onView={() => openForm("view", user)} onEdit={() => openForm("edit", user)} onCopy={() => navigator.clipboard?.writeText(user.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataPagination {...pagination} onPageChange={pagination.setPage} />
        </Card>
      </div>
      <UserForm open={form.open} mode={form.mode} user={form.user} onOpenChange={(open) => setForm((current) => ({ ...current, open }))} onModeChange={(mode) => setForm((current) => ({ ...current, mode }))} />
    </>
  )
}
