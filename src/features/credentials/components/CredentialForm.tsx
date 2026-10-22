import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FormMode } from "@/types/components"
import type { CredentialCreate, CredentialUpdate } from "@/service"
import type { Credential } from "../types/credentials.type"

/** Sheet quản lý thông tin xác thực dùng để kết nối tới thiết bị mạng. */
export function CredentialForm({
  open,
  mode,
  credential,
  onOpenChange,
  onModeChange,
  onSave,
}: {
  open: boolean
  mode: FormMode
  credential: Credential | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
  onSave: (payload: CredentialCreate | CredentialUpdate) => Promise<void>
}) {
  const readOnly = mode === "view"
  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel="credential"
      description="Credential metadata used by agents to connect to network devices."
      canEdit={!!credential}
      onEdit={() => onModeChange("edit")}
      onSubmit={async (data) => {
        const password = String(data.get("password") ?? "")
        const secret = String(data.get("secret") ?? "")
        await onSave({
          name: String(data.get("name") ?? ""),
          description: String(data.get("description") ?? "").trim() || null,
          username: String(data.get("username") ?? ""),
          encryption_type: "PGP_SYM_AES256",
          ...(password ? { password } : {}),
          ...(secret ? { secret } : {}),
        } as CredentialCreate | CredentialUpdate)
        onOpenChange(false)
      }}
    >
      <FormField label="Name" required>
        <Input
          name="name"
          defaultValue={credential?.name}
          disabled={readOnly}
          placeholder="GNS3 Lab - Cisco - Full Access"
        />
      </FormField>
      <FormField label="Description">
        <Textarea
          name="description"
          defaultValue={credential?.description ?? ""}
          disabled={readOnly}
          placeholder="Describe where this credential is used"
        />
      </FormField>
      <FormField label="Username" required>
        <Input
          name="username"
          defaultValue={credential?.username}
          disabled={readOnly}
          autoComplete="off"
        />
      </FormField>
      <FormField label={mode === "create" ? "Password" : "New password"} required={mode === "create"} hint={mode === "edit" ? "Để trống nếu không đổi mật khẩu." : undefined}>
        <Input name="password" type="password" required={mode === "create"} disabled={readOnly} autoComplete="new-password" />
      </FormField>
      <FormField label="Enable secret" hint="Không bắt buộc; dùng cho thiết bị yêu cầu privileged EXEC.">
        <Input name="secret" type="password" disabled={readOnly} autoComplete="new-password" />
      </FormField>
      <FormField label="Encryption type" required>
        <FormCombobox
          name="encryption_type"
          defaultValue={credential?.encryption_type ?? "PGP_SYM_AES256"}
          disabled={readOnly}
          options={[{ value: "PGP_SYM_AES256", label: "PGP_SYM_AES256" }]}
        />
      </FormField>
      {credential && (
        <div className="rounded-lg border bg-muted/30 p-3 type-caption text-muted-foreground">
          <p>
            ID: <span className="font-mono">{credential.id}</span>
          </p>
          <p className="mt-1">Assigned devices: {credential.device_count}</p>
          <p className="mt-1">
            Created by:{" "}
            <span className="font-mono">{credential.created_by}</span>
          </p>
          <p className="mt-1">
            Last updated by:{" "}
            <span className="font-mono">{credential.last_updated_by}</span>
          </p>
          <p className="mt-1">
            Updated:{" "}
            {new Date(credential.last_updated_at).toLocaleString("vi-VN")}
          </p>
        </div>
      )}
    </FeatureFormSheet>
  )
}
