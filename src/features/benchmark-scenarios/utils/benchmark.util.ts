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

/** Tạo danh sách số trang rút gọn, có dấu ba chấm khi khoảng trang bị gián đoạn. */
export function createBenchmarkScenarioPageItems(
  currentPage: number,
  pageCount: number,
): readonly (number | "ellipsis")[] {
  const visiblePages = Array.from(
    { length: pageCount },
    (_, index) => index + 1,
  ).filter(
    (page) => page === 1 || page === pageCount || Math.abs(page - currentPage) <= 1,
  )

  return visiblePages.flatMap((page, index) =>
    index > 0 && page - visiblePages[index - 1] > 1
      ? ["ellipsis" as const, page]
      : [page],
  )
}
