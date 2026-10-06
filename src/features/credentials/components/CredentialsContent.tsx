import { CirclePlus, KeyRound, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react"
import { useState } from "react"
import type { FormMode } from "@/types/components"
import { DataPagination } from "@/components/common/DataPagination"
import { FeatureHeader, StatCard, TableToolbar } from "@/components/common/FeatureShell"
import { MoreMenu } from "@/components/common/MoreMenu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCredentialsData } from "../hooks/use-credentials-data"
import type { Credential } from "../types"
import { CredentialForm } from "./CredentialForm"

/** Màn hình quản lý, tìm kiếm và kiểm tra các bộ thông tin xác thực. */
export function CredentialsContent() {
  const { query, rows, pagination, setQuery } = useCredentialsData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    credential: Credential | null
  }>({ open: false, mode: "create", credential: null })
  const openForm = (mode: FormMode, credential: Credential | null = null) => setForm({ open: true, mode, credential })
  const headerAction = (
    <Button size="sm" onClick={() => openForm("create")}>
      <CirclePlus />
      Add credential
    </Button>
  )
  return (
    <>
      <div className="space-y-5">
        <FeatureHeader title="Credentials" description="Encrypted access profiles used by agents to connect to devices." action={headerAction} />
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Credential sets" value="4" detail="4 encrypted profiles" icon={KeyRound} />
          <StatCard label="Assigned" value="3" detail="Used by 4 devices" icon={ShieldCheck} tone="green" />
          <StatCard label="Rotation due" value="1" detail="Within the next 7 days" icon={RefreshCw} tone="amber" />
        </div>
        <Card className="gap-0 py-0">
          <TableToolbar query={query} onQueryChange={setQuery} placeholder="Search ID or username..." />
          <Table>
            <TableHeader>
              <TableRow className="text-[10px] uppercase text-muted-foreground">
                <TableHead className="pl-4">Credential</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Encrypted secrets</TableHead>
                <TableHead>Encryption</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-4 font-mono text-[10px] text-muted-foreground">{item.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="grid size-7 place-items-center rounded-md bg-violet-500/10 text-violet-400">
                        <LockKeyhole className="size-3.5" />
                      </div>
                      <span className="text-xs font-medium">{item.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-mono text-[10px]">Password · {item.password.slice(-8)}</p>
                    <p className="mt-1 font-mono text-[9px] text-muted-foreground">Secret · {item.secret ? item.secret.slice(-8) : "Not set"}</p>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-md border px-2 py-1 text-[9px] text-emerald-400">{item.encryption_type}</span>
                  </TableCell>
                  <TableCell className="text-xs">{item.device_count}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">{new Date(item.last_updated_at).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>
                    <MoreMenu onView={() => openForm("view", item)} onEdit={() => openForm("edit", item)} onCopy={() => navigator.clipboard?.writeText(item.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataPagination {...pagination} onPageChange={pagination.setPage} />
        </Card>
      </div>
      <CredentialForm open={form.open} mode={form.mode} credential={form.credential} onOpenChange={(open) => setForm((current) => ({ ...current, open }))} onModeChange={(mode) => setForm((current) => ({ ...current, mode }))} />
    </>
  )
}
