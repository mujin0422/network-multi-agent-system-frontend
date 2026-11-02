import { useEffect, useState } from "react"

import { TaskEvaluationDetails } from "@/components/shared/TaskEvaluationDetails"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { evaluationsApi } from "@/service"
import type { TaskEvaluationDetail } from "@/service"

type BenchmarkEvaluationSheetProps = {
  open: boolean
  taskId: string | null
  onOpenChange: (open: boolean) => void
}

/** Read-only breakdown of persisted metrics for a completed benchmark run. */
export function BenchmarkEvaluationSheet({ open, taskId, onOpenChange }: BenchmarkEvaluationSheetProps) {
  const [evaluation, setEvaluation] = useState<TaskEvaluationDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !taskId) return
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      setEvaluation(null)
      try {
        const result = await evaluationsApi.byTask(taskId)
        if (!cancelled) setEvaluation(result)
      } catch (reason) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Không thể tải Evaluation")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [open, taskId])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-3xl!">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>Benchmark evaluation</SheetTitle>
          <SheetDescription className="break-all font-mono text-xs">{taskId ?? "—"}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {loading ? (
            <div role="status" className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-44 w-full" />
              <span className="sr-only">Loading Evaluation</span>
            </div>
          ) : (
            <TaskEvaluationDetails evaluation={evaluation} error={error} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
