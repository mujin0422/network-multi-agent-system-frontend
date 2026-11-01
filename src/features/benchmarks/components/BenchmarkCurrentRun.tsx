import { ExternalLink, RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BENCHMARK_STATUS_KEYS } from "../constants/benchmarks.constants"
import type { BenchmarkCurrentRunProps } from "../types/benchmark.type"

export function BenchmarkCurrentRun({ run, busy, onOpenChat, onCleanup }: BenchmarkCurrentRunProps) {
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>{run.scenario_name}</CardTitle>
            <CardDescription className="mt-1 text-xs">{t("benchmarks.run")} {run.id} · {t(BENCHMARK_STATUS_KEYS[run.status])}</CardDescription>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs ${run.evaluation_result === "PASS" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-border text-muted-foreground"}`}>
            {run.evaluation_result ?? t(BENCHMARK_STATUS_KEYS[run.status])}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {run.status === "READY" && <Button size="sm" onClick={onOpenChat}><ExternalLink /> {t("benchmarks.openInChat")}</Button>}
        {run.cleanup_required && <Button size="sm" variant="outline" onClick={onCleanup} disabled={busy}><RotateCcw /> {t("benchmarks.cleanupEnvironment")}</Button>}
        {run.error_message && <p className="w-full text-xs text-destructive">{run.error_message}</p>}
      </CardContent>
    </Card>
  )
}
