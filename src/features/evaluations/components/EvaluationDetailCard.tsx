import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

import { StatusBadge } from "@/components/shared/StatusBadge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export type EvaluationDetailSection = {
  label: string
  value: unknown
}

type EvaluationDetailCardProps = {
  metricLabel: string
  requirementLabel: string
  attemptedLabel?: string | null
  result?: string
  value?: string | null
  details: EvaluationDetailSection[]
  children?: ReactNode
}

function DetailValue({ value }: { value: unknown }) {
  return (
    <pre className="no-scrollbar max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-lg border bg-muted/20 p-3 font-mono text-xs leading-relaxed">
      {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
    </pre>
  )
}

/** Card dùng chung cho một metric Evaluation và các dữ liệu chi tiết có thể bung/thu. */
export function EvaluationDetailCard({
  metricLabel,
  requirementLabel,
  attemptedLabel,
  result,
  value,
  details,
  children,
}: EvaluationDetailCardProps) {
  const visibleDetails = details.filter((detail) => detail.value != null)
  const description = [requirementLabel, attemptedLabel]
    .filter(Boolean)
    .join(" · ")

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{metricLabel}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
        <CardAction>
          {value ? (
            <StatusBadge value="SUCCESS" label={value} />
          ) : result ? (
            <StatusBadge value={result} />
          ) : null}
        </CardAction>
      </CardHeader>

      {(children || visibleDetails.length > 0) && (
        <CardContent className="space-y-2">
          {children}
          {visibleDetails.map((detail) => (
            <Collapsible key={detail.label}>
              <CollapsibleTrigger className="group flex w-full items-center gap-1.5 rounded-md py-1.5 text-left text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50">
                <ChevronRight className="size-3.5 transition-transform group-data-[panel-open]:rotate-90" />
                <span>{detail.label}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-1">
                <DetailValue value={detail.value} />
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
