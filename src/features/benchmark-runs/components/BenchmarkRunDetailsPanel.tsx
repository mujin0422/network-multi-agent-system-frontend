import { useTranslation } from "react-i18next"

import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import type { BenchmarkRun } from "@/service"

type BenchmarkRunDetailsPanelProps = {
  run: BenchmarkRun | null
  busy: boolean
  confirmCleanup: boolean
  onOpenChat: () => void
  onViewEvaluation: () => void
  onRequestCleanup: () => void
  onCancelCleanup: () => void
  onConfirmCleanup: () => void
}

function displayTime(value: string | null): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString()
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 break-all text-foreground">{value || "—"}</span>
    </div>
  )
}

/** Read-only run details alongside the DataTable, following the Tasks split layout. */
export function BenchmarkRunDetailsPanel({
  run,
  busy,
  confirmCleanup,
  onOpenChat,
  onViewEvaluation,
  onRequestCleanup,
  onCancelCleanup,
  onConfirmCleanup,
}: BenchmarkRunDetailsPanelProps) {
  const { t } = useTranslation()

  if (!run) {
    return (
      <Card className="grid min-h-64 place-items-center text-xs text-muted-foreground">
        {t("benchmarkRuns.empty")}
      </Card>
    )
  }

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-sm">{t("benchmarkRuns.detailsTitle")}</CardTitle>
            <p className="break-all font-mono text-[11px] text-muted-foreground">{run.id}</p>
          </div>
          <StatusBadge value={run.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium leading-5">{run.scenario_name}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{run.initial_message}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("benchmarkRuns.evaluation")}:</span>
          {run.evaluation_result
            ? <StatusBadge value={run.evaluation_result} />
            : <span className="text-xs text-muted-foreground">—</span>}
          {run.cleanup_required && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-500">
              {t("benchmarkRuns.cleanupPending")}
            </span>
          )}
        </div>

        <div className="space-y-3 border-t pt-4">
          <DetailRow label={t("benchmarkRuns.scenarioVersion")} value={run.scenario_version} />
          <DetailRow label="Task ID" value={run.task_id ?? "—"} />
          <DetailRow label="Conversation ID" value={run.conversation_id ?? "—"} />
          <DetailRow label={t("benchmarkRuns.started")} value={displayTime(run.started_at)} />
          <DetailRow label={t("benchmarkRuns.completed")} value={displayTime(run.completed_at)} />
          <DetailRow label={t("benchmarkRuns.cleanedAt")} value={displayTime(run.cleaned_at)} />
        </div>

        {run.error_message && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {run.error_message}
          </p>
        )}

        <div className="flex flex-wrap gap-2 border-t pt-4">
          {run.status === "READY" && (
            <Button size="sm" onClick={onOpenChat} disabled={busy}>
              {t("benchmarks.openInChat")}
            </Button>
          )}
          {run.evaluation_id && run.task_id && (
            <Button size="sm" variant="outline" onClick={onViewEvaluation} disabled={busy}>
              {t("benchmarkRuns.viewEvaluation")}
            </Button>
          )}
          {run.cleanup_required && !confirmCleanup && (
            <Button size="sm" variant="outline" onClick={onRequestCleanup} disabled={busy}>
              {t("benchmarks.cleanupEnvironment")}
            </Button>
          )}
        </div>

        {confirmCleanup && run.cleanup_required && (
          <div className="space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3">
            <p className="text-xs">{t("benchmarkRuns.cleanupWarning")}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={onCancelCleanup} disabled={busy}>
                {t("benchmarkRuns.cancel")}
              </Button>
              <Button size="sm" variant="destructive" onClick={onConfirmCleanup} disabled={busy}>
                {t("benchmarkRuns.confirmCleanup")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
