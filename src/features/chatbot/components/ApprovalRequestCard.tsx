import { useState } from "react"
import { AlertTriangle, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApprovalRequest } from "../types/chat-task-preview.type"

/** Hiển thị đầy đủ phạm vi thay đổi trước khi người dùng ra quyết định. */
export function ApprovalRequestCard({ approval }: { approval: ApprovalRequest }) {
  const [decision, setDecision] = useState(approval.status)
  const decided = decision !== "PENDING"

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
        {decided ? (
          <div className="rounded-lg border bg-background/70 px-3 py-2 text-xs font-medium">
            Quyết định: {decision === "APPROVED" ? "Đã phê duyệt" : "Đã từ chối"}
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button size="sm" variant="outline" onClick={() => setDecision("REJECTED")}>
              <X /> Từ chối
            </Button>
            <Button size="sm" onClick={() => setDecision("APPROVED")}>
              <Check /> Phê duyệt và tiếp tục
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
