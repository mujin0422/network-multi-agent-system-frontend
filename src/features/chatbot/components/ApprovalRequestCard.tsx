import { useState } from "react"
import { AlertTriangle, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApprovalRequest } from "../types/chat-task-preview.type"

/** Hiển thị đầy đủ phạm vi thay đổi trước khi người dùng ra quyết định. */
export function ApprovalRequestCard({
  approval,
  onDecision,
}: {
  approval: ApprovalRequest
  onDecision: (approvalId: string, decision: "APPROVED" | "REJECTED") => Promise<void>
}) {
  const [localDecision, setLocalDecision] = useState<
    "APPROVED" | "REJECTED" | null
  >(null)
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const decision = localDecision ?? approval.status
  const decided = decision !== "PENDING"
  const decisionLabel: Record<ApprovalRequest["status"], string> = {
    PENDING: "Đang chờ phê duyệt",
    APPROVED: "Đã phê duyệt",
    REJECTED: "Đã từ chối",
    EXPIRED: "Đã hết thời hạn phê duyệt",
  }
  const expiresAt = approval.expires_at ? new Date(approval.expires_at) : null
  const expiryLabel = expiresAt && !Number.isNaN(expiresAt.getTime())
    ? expiresAt.toLocaleString("vi-VN")
    : null

  async function decide(nextDecision: "APPROVED" | "REJECTED") {
    // Hiển thị quyết định ngay trong khi workflow tiếp tục polling ở nền.
    setLocalError(null)
    setLocalDecision(nextDecision)
    setSubmitting(true)
    try {
      await onDecision(approval.id, nextDecision)
    } catch (error) {
      // Không đánh dấu đã duyệt khi API POST thực sự thất bại.
      setLocalDecision(null)
      setLocalError(error instanceof Error ? error.message : "Không thể gửi quyết định phê duyệt")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="mt-3 border-amber-500/25 bg-amber-500/[0.04] shadow-none">
      <CardHeader className="grid-cols-[auto_1fr_auto] items-start gap-3">
        <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="size-4" />
        </span>
        <div>
          <CardTitle>{approval.title}</CardTitle>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {approval.description}
          </p>
        </div>
        <span className="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-amber-700 dark:text-amber-300">
          {approval.risk_level} RISK
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 text-xs sm:grid-cols-2">
          <div>
            <p className="font-medium text-foreground">Thiết bị</p>
            <p className="mt-1 text-muted-foreground">{approval.devices.join(", ")}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Operation ID</p>
            <p className="mt-1 font-mono text-muted-foreground">
              {approval.operation_id}
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-background/70 p-3 font-mono text-xs leading-5">
          {approval.commands.map((command) => (
            <div key={command}>$ {command}</div>
          ))}
        </div>
        {expiryLabel && (
          <p className="text-xs text-muted-foreground">
            Hạn phê duyệt: <time dateTime={approval.expires_at ?? undefined}>{expiryLabel}</time>
          </p>
        )}
        {localError && <p role="alert" className="text-xs text-destructive">{localError}</p>}
        {decided ? (
          <div className="rounded-lg border bg-background/70 px-3 py-2 text-xs font-medium">
            Trạng thái: {decisionLabel[decision]}
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button size="sm" variant="outline" disabled={submitting} onClick={() => void decide("REJECTED")}>
              <X /> Từ chối
            </Button>
            <Button size="sm" disabled={submitting} onClick={() => void decide("APPROVED")}>
              <Check /> Phê duyệt và tiếp tục
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
