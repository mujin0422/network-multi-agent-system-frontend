import { FeatureFormSheet, FormCombobox, FormField } from "@/components/common/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import type { FormMode } from "@/types/components"
import type { Credential } from "../types"

/** Sheet quản lý thông tin xác thực dùng để kết nối tới thiết bị mạng. */
export function CredentialForm({ open, mode, credential, onOpenChange, onModeChange }: { open: boolean; mode: FormMode; credential: Credential | null; onOpenChange: (open: boolean) => void; onModeChange: (mode: FormMode) => void }) {
  const readOnly = mode === "view"
  return (
    <FeatureFormSheet open={open} onOpenChange={onOpenChange} mode={mode} entityLabel="credential" description="Sensitive values are encrypted before storage and never displayed in plaintext." canEdit={!!credential} onEdit={() => onModeChange("edit")} onSubmit={() => onOpenChange(false)}>
      <FormField label="Username" required>
        <Input name="username" defaultValue={credential?.username} disabled={readOnly} autoComplete="off" />
      </FormField>
      <FormField label="Password" required hint={mode === "edit" ? "Leave unchanged to retain the current encrypted password." : "This value will be encrypted with AES-256-GCM."}>
        <Input name="password" type="password" defaultValue={mode === "view" ? credential?.password : ""} disabled={readOnly} autoComplete="new-password" placeholder={mode === "edit" ? "Unchanged" : "Enter device password"} />
      </FormField>
      <FormField label="Enable secret" hint="Optional privileged mode secret.">
        <Input name="secret" type="password" defaultValue={mode === "view" ? (credential?.secret ?? "") : ""} disabled={readOnly} autoComplete="new-password" placeholder={mode === "edit" ? "Unchanged" : "Optional"} />
      </FormField>
      <FormField label="Encryption type" required>
        <FormCombobox name="encryption_type" defaultValue={credential?.encryption_type ?? "AES-256-GCM"} disabled={readOnly} options={[{ value: "AES-256-GCM", label: "AES-256-GCM" }]} />
      </FormField>
      {credential && (
        <div className="rounded-lg border bg-muted/30 p-3 text-[10px] text-muted-foreground">
          <p>
            ID: <span className="font-mono">{credential.id}</span>
          </p>
          <p className="mt-1">Assigned devices: {credential.device_count}</p>
          <p className="mt-1">Updated: {new Date(credential.last_updated_at).toLocaleString("vi-VN")}</p>
        </div>
      )}
    </FeatureFormSheet>
  )
}
