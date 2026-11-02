import { Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BenchmarkScenarioCardProps } from "../types/benchmark.type"

/** Thẻ kịch bản: ưu tiên nội dung, hành động tách rõ khỏi metadata. */
export function BenchmarkScenarioCard({
  scenario,
  busy,
  startDisabled,
  editLoading,
  onEdit,
  onStart,
  onToggle,
}: BenchmarkScenarioCardProps) {
  const { t } = useTranslation()

  return (
    <Card size="sm" className="h-full gap-0">
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-sm leading-5">{scenario.name}</CardTitle>
        <CardDescription className="text-xs leading-5">{scenario.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-2 py-1">{scenario.scenario_key}</span>
          <span className="rounded-full border px-2 py-1">{scenario.topology}</span>
          <span className="rounded-full border px-2 py-1">v{scenario.version}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => onStart(scenario.id)} disabled={!scenario.is_active || startDisabled}>
            {t("benchmarks.startBenchmark")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(scenario.id)} disabled={busy || editLoading}>
            <Pencil className="size-3.5" />
            {t("common.edit")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onToggle(scenario)} disabled={busy || editLoading}>
            {scenario.is_active ? t("benchmarks.disable") : t("benchmarks.enable")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
