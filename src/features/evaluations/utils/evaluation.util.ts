import type { BenchmarkRun, Task, TaskEvaluationSummary, User } from "@/service"
import type { EvaluationMetrics, EvaluationTableRow } from "../types/evaluation.type"

export function buildEvaluationRows(
  evaluations: TaskEvaluationSummary[],
  runs: BenchmarkRun[],
  tasks: Task[],
  usersById: Map<string, User>,
  fallbackScenarioName: string,
): EvaluationTableRow[] {
  const runsByTask = new Map(runs.flatMap((run) => run.task_id ? [[run.task_id, run] as const] : []))
  const tasksById = new Map(tasks.map((task) => [task.id, task]))
  return evaluations.map((evaluation) => {
    const run = runsByTask.get(evaluation.task_id) ?? null
    const ownerId = tasksById.get(evaluation.task_id)?.user_id ?? null
    const owner = ownerId ? usersById.get(ownerId) : undefined
    return {
      ...evaluation,
      run,
      scenarioName: run?.scenario_name ?? fallbackScenarioName,
      rcaResult: evaluation.results.RCA ?? "UNKNOWN",
      ownerId,
      ownerName: owner?.full_name ?? null,
      ownerEmail: owner?.email ?? null,
    }
  })
}

export function calculateEvaluationMetrics(evaluations: TaskEvaluationSummary[]): EvaluationMetrics {
  const latencySamples = evaluations.flatMap((evaluation) => {
    const value = evaluation.measurements?.LATENCY
    return value == null ? [] : [value]
  })
  const interactionSamples = evaluations.flatMap((evaluation) => {
    const value = evaluation.measurements?.INTERACTION_TURNS
    return value == null ? [] : [value]
  })
  return {
    countAutomated: evaluations.filter((item) => item.evaluator_type === "AUTOMATED").length,
    latencySamples,
    interactionSamples,
    averageLatency: latencySamples.length
      ? latencySamples.reduce((total, value) => total + value, 0) / latencySamples.length / 1000
      : null,
    averageInteractions: interactionSamples.length
      ? interactionSamples.reduce((total, value) => total + value, 0) / interactionSamples.length
      : null,
  }
}
