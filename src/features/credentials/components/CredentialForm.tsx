import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FormMode } from "@/types/components"
import type { Credential } from "../types/credentials.type"

/** Sheet quản lý thông tin xác thực dùng để kết nối tới thiết bị mạng. */
export function CredentialForm({
  open,
  mode,
  credential,
  onOpenChange,
  onModeChange,
}: {
  open: boolean
  mode: FormMode
  credential: Credential | null
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: FormMode) => void
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
      onSubmit={() => onOpenChange(false)}
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
      <FormField label="Encryption type" required>
        <FormCombobox
          name="encryption_type"
          defaultValue={credential?.encryption_type ?? "PGP_SYM_AES256"}
          disabled={readOnly}
          options={[{ value: "PGP_SYM_AES256", label: "PGP_SYM_AES256" }]}
        />
      </FormField>
      {credential && (
        <div className="rounded-lg border bg-muted/30 p-3 text-[10px] text-muted-foreground">
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
