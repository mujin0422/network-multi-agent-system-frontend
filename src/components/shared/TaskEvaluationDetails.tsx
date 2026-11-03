import { StatusBadge } from "@/components/shared/StatusBadge"
import { useTranslation } from "react-i18next"
import type { TaskEvaluationDetail, TaskEvaluationMetric } from "@/service"

type TaskEvaluationDetailsProps = {
  evaluation: TaskEvaluationDetail | null
  error?: string | null
}

const METRIC_LABELS: Record<TaskEvaluationMetric["metric_type"], string> = {
  GOAL: "Goal",
  RCA: "Root cause analysis (RCA)",
  REMEDIATION: "Remediation",
  SAFETY: "Safety",
  LATENCY: "AI workflow active time",
  INTERACTION_TURNS: "Interaction turns (Agent → Tool)",
}

function formatMeasurement(metric: TaskEvaluationMetric, version: string | null): string | null {
  const value = metric.actual_value
  if (typeof value !== "object" || value === null) return null
  const raw = value as Record<string, unknown>

  if (metric.metric_type === "LATENCY") {
    const duration = version === "db-benchmark-v3"
      ? raw.active_duration_ms
      : raw.duration_ms
    return typeof duration === "number" ? `${(duration / 1000).toFixed(2)} s` : null
  }
  if (metric.metric_type === "INTERACTION_TURNS" && typeof raw.count === "number") {
    return `${raw.count} tool calls`
  }
  return null
}

function formatDate(date: string | null) {
  if (!date) return "—"
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleString("vi-VN")
}

function Evidence({ label, value }: { label: string; value: unknown }) {
  if (value == null) return null
  return (
    <details className="text-xs">
      <summary className="cursor-pointer py-1 text-muted-foreground">{label}</summary>
      <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-lg border bg-muted/20 p-3 font-mono text-xs leading-relaxed">
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </pre>
    </details>
  )
}

/** Display persisted evaluation metrics. Never infer an unrecorded PASS/FAIL. */
export function TaskEvaluationDetails({ evaluation, error }: TaskEvaluationDetailsProps) {
  const { t } = useTranslation()
  if (error) {
    return <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive">{error}</p>
  }
  if (!evaluation) {
    return (
      <div className="rounded-lg border border-dashed p-5 text-xs text-muted-foreground">
        Chưa có kết quả Evaluation được lưu cho Task này. Đánh giá tự động hiện chỉ được
        tạo cho benchmark sau khi Agent có phản hồi cuối; Task thông thường không có
        ground truth sẽ không được tự động chấm PASS/FAIL.
      </div>
    )
  }
  return (
    <section className="space-y-4">
      <div className="space-y-2 rounded-xl border bg-card p-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold">Task evaluation</p>
          <StatusBadge value={evaluation.evaluation_status} />
        </div>
        <p className="break-all font-mono text-muted-foreground">{evaluation.id}</p>
        <p className="text-muted-foreground">
          {evaluation.evaluator_type} · {evaluation.evaluator_version ?? "unknown version"} · {formatDate(evaluation.evaluated_at)}
        </p>
        {["db-benchmark-v1", "db-benchmark-v2", "db-benchmark-v3"].includes(evaluation.evaluator_version ?? "") && (
          <p className="rounded-md border p-2 text-muted-foreground">
            Cách chấm hiện tại dựa vào từ khóa có trong câu trả lời của AI, không phải
            kiểm định độc lập cấu hình mạng. REMEDIATION/SAFETY được ghi nhận
            NOT_APPLICABLE, không có nghĩa là đã kiểm chứng an toàn.
          </p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {evaluation.metrics.map((metric) => (
          <article key={metric.id} className="space-y-3 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{metric.metric_type === "LATENCY"
                ? evaluation.evaluator_version === "db-benchmark-v3"
                  ? t("evaluationsPage.latencyDetail")
                  : t("evaluationsPage.legacyLatencyDetail")
                : METRIC_LABELS[metric.metric_type] ?? metric.metric_type}</h3>
              {metric.metric_type === "LATENCY" || metric.metric_type === "INTERACTION_TURNS" ? (
                <span className="text-sm font-semibold tabular-nums">
                  {formatMeasurement(metric, evaluation.evaluator_version) ?? "—"}
                </span>
              ) : (
                <StatusBadge value={metric.result} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {(metric.metric_type === "LATENCY" || metric.metric_type === "INTERACTION_TURNS") ? "Measured · no PASS/FAIL threshold" : (metric.is_required ? "Required" : "Optional")}
              {metric.was_attempted != null ? ` · Attempted: ${metric.was_attempted ? "Yes" : "No"}` : ""}
            </p>
            <Evidence label="Expected value" value={metric.expected_value} />
            <Evidence label="Actual value" value={metric.actual_value} />
            <Evidence label="Evidence" value={metric.evidence} />
          </article>
        ))}
      </div>
      {evaluation.metrics.length === 0 && (
        <p className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
          Evaluation chưa có metric nào được lưu.
        </p>
      )}
    </section>
  )
}
