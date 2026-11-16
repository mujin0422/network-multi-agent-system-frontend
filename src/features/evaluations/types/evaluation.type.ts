import type { BenchmarkRun, EvaluationResult, TaskEvaluationSummary } from "@/service"

export type EvaluationTableRow = TaskEvaluationSummary & {
  scenarioName: string
  run: BenchmarkRun | null
  rcaResult: EvaluationResult
  ownerId: string | null
  ownerName: string | null
  ownerEmail: string | null
}

export type EvaluationMetrics = {
  countAutomated: number
  latencySamples: number[]
  interactionSamples: number[]
  averageLatency: number | null
  averageInteractions: number | null
}
