export function benchmarkErrorMessage(reason: unknown, fallback: string) {
  return reason instanceof Error ? reason.message : fallback
}

export function benchmarkChatPath(runId: string, initialMessage: string) {
  const params = new URLSearchParams({
    benchmark_run_id: runId,
    prompt: initialMessage,
  })
  return `/chat?${params.toString()}`
}
