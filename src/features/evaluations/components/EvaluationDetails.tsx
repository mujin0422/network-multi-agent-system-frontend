import { useTranslation } from "react-i18next"

import { StatusBadge } from "@/components/shared/StatusBadge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { TaskEvaluationDetail, TaskEvaluationMetric } from "@/service"

import { EvaluationDetailCard } from "./EvaluationDetailCard"

type EvaluationDetailsProps = {
  evaluation: TaskEvaluationDetail | null
  error?: string | null
}

const METRIC_LABELS: Record<TaskEvaluationMetric["metric_type"], string> = {
  GOAL: "Goal",
  RCA: "Root cause analysis (RCA)",
  REMEDIATION: "Remediation",
  SAFETY: "Safety",
  LATENCY: "Latency",
  INTERACTION_TURNS: "Interaction turns",
}

function formatMeasurement(metric: TaskEvaluationMetric): string | null {
  const value = metric.actual_value
  if (typeof value !== "object" || value === null) return null
  const raw = value as Record<string, unknown>

  if (metric.metric_type === "LATENCY") {
    const duration = raw.active_duration_ms ?? raw.duration_ms
    return typeof duration === "number" ? `${(duration / 1000).toFixed(2)} s` : null
  }

  if (metric.metric_type === "INTERACTION_TURNS" && typeof raw.count === "number") {
    return `${raw.count} tool calls`
  }

  return null
}

function StructuredRcaScores({ metric }: { metric: TaskEvaluationMetric }) {
  const { t } = useTranslation()
  const raw = metric.actual_value
  if (!raw || typeof raw !== "object") return null

  const values = raw as Record<string, unknown>
  const scores = [
    ["rca_f1", t("evaluationsPage.rcaF1")],
    ["rca_precision", t("evaluationsPage.rcaPrecision")],
    ["rca_recall", t("evaluationsPage.rcaRecall")],
    ["localization_f1", t("evaluationsPage.localizationF1")],
    ["fault_type_f1", t("evaluationsPage.faultTypeF1")],
    ["detection_score", t("evaluationsPage.detectionScore")],
  ] as const

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {scores.map(([key, label]) => {
        const score = values[key]
        return (
          <Card key={key} size="sm">
            <CardContent>
              <p className="text-[11px] text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {typeof score === "number" ? `${(score * 100).toFixed(1)}%` : "—"}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

/** Hiển thị Evaluation đã lưu và lắp ghép card cho từng metric. */
export function EvaluationDetails({ evaluation, error }: EvaluationDetailsProps) {
  const { t } = useTranslation()

  if (error) {
    return (
      <Card role="alert" className="ring-destructive/30">
        <CardContent className="text-xs text-destructive">{error}</CardContent>
      </Card>
    )
  }

  if (!evaluation) {
    return (
      <Card className="border-dashed bg-transparent">
        <CardContent className="text-xs text-muted-foreground">
          Chưa có kết quả Evaluation được lưu cho Task này. Evaluation tự động chỉ được
          tạo cho benchmark có ground truth sau khi Agent tạo phản hồi cuối.
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="space-y-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>{t("evaluationsPage.taskEvaluation")}</CardTitle>
          <CardDescription className="break-all font-mono text-xs">
            {evaluation.id}
          </CardDescription>
          <CardAction>
            <StatusBadge value={evaluation.evaluation_status} />
          </CardAction>
        </CardHeader>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {evaluation.metrics.map((metric) => {
          const isMeasurement =
            metric.metric_type === "LATENCY" || metric.metric_type === "INTERACTION_TURNS"

          return (
            <EvaluationDetailCard
              key={metric.id}
              metricLabel={METRIC_LABELS[metric.metric_type]}
              requirementLabel={
                isMeasurement
                  ? t("evaluationsPage.metric.measured")
                  : metric.is_required
                    ? t("evaluationsPage.metric.required")
                    : t("evaluationsPage.metric.optional")
              }
              attemptedLabel={
                metric.was_attempted == null
                  ? null
                  : t("evaluationsPage.metric.attempted", {
                      value: metric.was_attempted
                        ? t("evaluationsPage.metric.yes")
                        : t("evaluationsPage.metric.no"),
                    })
              }
              result={isMeasurement ? undefined : metric.result}
              value={formatMeasurement(metric)}
              details={[
                {
                  label: t("evaluationsPage.metric.expectedValue"),
                  value: metric.expected_value,
                },
                {
                  label: t("evaluationsPage.metric.actualValue"),
                  value: metric.actual_value,
                },
                {
                  label: t("evaluationsPage.metric.evidence"),
                  value: metric.evidence,
                },
              ]}
            >
              {metric.metric_type === "RCA" && <StructuredRcaScores metric={metric} />}
            </EvaluationDetailCard>
          )
        })}
      </div>

      {evaluation.metrics.length === 0 && (
        <Card className="border-dashed bg-transparent">
          <CardContent className="text-xs text-muted-foreground">
            Evaluation chưa có metric nào được lưu.
          </CardContent>
        </Card>
      )}
    </section>
  )
}
