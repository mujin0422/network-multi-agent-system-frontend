import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { BENCHMARK_STATUS_KEYS } from "../constants/benchmarks.constants"
import type { BenchmarkRunHistoryProps } from "../types/benchmark.type"

export function BenchmarkRunHistory({ runs, onSelect }: BenchmarkRunHistoryProps) {
  const { t, i18n } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{t("benchmarks.recentRuns")}</CardTitle>
        <CardDescription className="text-xs">{t("benchmarks.recentRunsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("benchmarks.emptyRuns")}</p>
        ) : (
          <div className="divide-y rounded-lg border">
            {runs.map((run) => (
              <button
                className="flex w-full flex-wrap items-center justify-between gap-3 p-3 text-left hover:bg-muted/40"
                key={run.id}
                onClick={() => onSelect(run)}
                type="button"
              >
                <span>
                  <span className="block text-sm font-medium">{run.scenario_name}</span>
                  <span className="block text-xs text-muted-foreground">{run.id} · {new Date(run.started_at).toLocaleString(i18n.language)}</span>
                </span>
                <span className="rounded-full border px-2 py-1 text-xs text-muted-foreground">
                  {run.evaluation_result ?? t(BENCHMARK_STATUS_KEYS[run.status])}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
