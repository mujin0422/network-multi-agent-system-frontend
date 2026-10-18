import { useState } from "react"
import type { FormMode } from "@/types/components"
import {
  DataTable,
  DataTableContent,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
} from "@/components/shared/DataTable"
import { MoreMenu } from "@/components/shared/MoreMenu"
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { useCredentialsData } from "../hooks/use-credentials-data"
import type { Credential } from "../types/credentials.type"
import { CredentialForm } from "./CredentialForm"
import { CredentialStats } from "./CredentialStats"

/** Màn hình quản lý, tìm kiếm và kiểm tra các bộ thông tin xác thực. */
export function CredentialsTable() {
  const { rows, summary, auditUserName } = useCredentialsData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    credential: Credential | null
  }>({ open: false, mode: "create", credential: null })
  const openForm = (mode: FormMode, credential: Credential | null = null) =>
    setForm({ open: true, mode, credential })
  const headerAction = (
    <Button size="sm" onClick={() => openForm("create")}>
      Add credential
    </Button>
  )
  const auditTimestamp = (timestamp: string) =>
    new Date(timestamp).toLocaleString("vi-VN")

  return (
    <>
      <PageLayout>
        <PageLayoutHeader
          title="Credentials"
          description="Encrypted access profiles used by agents to connect to devices."
        >
          {headerAction}
        </PageLayoutHeader>
        <CredentialStats summary={summary} />
        <PageLayoutContent>
          <DataTable
            data={rows}
            getRowId={(item) => item.id}
            searchValue={(item) =>
              `${item.id} ${item.name} ${item.description ?? ""} ${item.username} ${item.encryption_type}`
            }
            columns={[
              {
                id: "credential",
                header: "Credential",
                cell: (item) => (
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{item.name}</p>
                    <p className="font-mono type-caption text-success">
                      {item.id}
                    </p>
                  </div>
                ),
              },
              {
                id: "description",
                header: "Description",
                className: "max-w-64 type-caption text-muted-foreground",
                cell: (item) => (
                  <p className="line-clamp-2">{item.description ?? "—"}</p>
                ),
              },
              {
                id: "username",
                header: "Username",
                accessorKey: "username",
                className: "text-xs font-medium",
              },
              {
                id: "encryption",
                header: "Encryption",
                cell: (item) => (
                  <span className="rounded-md border border-success/20 bg-success/10 px-2 py-1 type-caption text-success">
                    {item.encryption_type}
                  </span>
                ),
              },
              {
                id: "devices",
                header: "Devices",
                accessorKey: "device_count",
                className: "text-xs",
              },
              {
                id: "timestamp",
                header: "Timestamp",
                className: "min-w-72 text-muted-foreground",
                cell: (item) => (
                  <div className="type-micro space-y-1 whitespace-nowrap">
                    <p>
                      <span className="font-medium text-foreground">
                        Created by:
                      </span>{" "}
                      {auditUserName(item.created_by)} ·{" "}
                      {auditTimestamp(item.created_at)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Updated by:
                      </span>{" "}
                      {auditUserName(item.last_updated_by)} ·{" "}
                      {auditTimestamp(item.last_updated_at)}
                    </p>
                  </div>
                ),
              },
              {
                id: "actions",
                header: null,
                cell: (item) => (
                  <MoreMenu
                    onView={() => openForm("view", item)}
                    onEdit={() => openForm("edit", item)}
                    onCopy={() => navigator.clipboard?.writeText(item.id)}
                  />
                ),
              },
            ]}
          >
            <DataTablePanel>
              <DataTableToolbar>
                <DataTableSearch placeholder="Search ID, name, or username..." />
              </DataTableToolbar>
              <DataTableContent />
              <DataTablePagination itemLabel="credentials" />
            </DataTablePanel>
          </DataTable>
        </PageLayoutContent>
      </PageLayout>
      <CredentialForm
        open={form.open}
        mode={form.mode}
        credential={form.credential}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
        onModeChange={(mode) => setForm((current) => ({ ...current, mode }))}
      />
    </>
  )
}
