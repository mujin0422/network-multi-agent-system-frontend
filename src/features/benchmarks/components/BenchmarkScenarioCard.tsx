import { FlaskConical } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BenchmarkScenarioCardProps } from "../types/benchmark.type"

export function BenchmarkScenarioCard({ scenario, busy, startDisabled, onStart, onToggle }: BenchmarkScenarioCardProps) {
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <div className="mb-3 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <FlaskConical className="size-4" />
        </div>
        <CardTitle>{scenario.name}</CardTitle>
        <CardDescription className="text-xs">{scenario.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-2 py-1">{scenario.scenario_key}</span>
          <span className="rounded-full border px-2 py-1">{scenario.topology}</span>
          <span className="rounded-full border px-2 py-1">v{scenario.version}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => onStart(scenario.id)} disabled={!scenario.is_active || startDisabled}>{t("benchmarks.startBenchmark")}</Button>
          <Button size="sm" variant="outline" onClick={() => onToggle(scenario)} disabled={busy}>
            {scenario.is_active ? t("benchmarks.disable") : t("benchmarks.enable")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
