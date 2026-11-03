import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
} from "@/components/shared/PageLayout"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type PageLoadingVariant = "table" | "dashboard" | "split" | "cards" | "profile"

type PageLoadingSkeletonProps = {
  title: string
  description?: string
  stats?: number
  variant?: PageLoadingVariant
}

/** One subtle loading surface per card/panel; no nested placeholder lines. */
function LoadingFrame({ className }: { className: string }) {
  return (
    <Skeleton
      aria-hidden="true"
      className={cn("min-w-0 rounded-xl border border-border bg-card/80", className)}
    />
  )
}

/** Keep page layout while loading without drawing placeholder content inside each frame. */
export function PageLoadingSkeleton({
  title,
  description,
  stats = 4,
  variant = "table",
}: PageLoadingSkeletonProps) {
  return (
    <PageLayout>
      <PageLayoutHeader title={title} description={description} />
      {stats > 0 && (
        <PageLayoutOverview
          className={
            variant === "dashboard"
              ? "grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5"
              : undefined
          }
        >
          {Array.from({ length: stats }, (_, index) => (
            <LoadingFrame key={index} className="h-24" />
          ))}
        </PageLayoutOverview>
      )}
      <PageLayoutContent>
        <div role="status" aria-busy="true" aria-label="Loading page content" className="space-y-4">
          <span className="sr-only">Loading page content...</span>
          {variant === "table" && <LoadingFrame className="h-[30rem]" />}

          {variant === "dashboard" && (
            <>
              <LoadingFrame className="h-60" />
              <LoadingFrame className="h-40" />
              <div className="grid gap-4 xl:grid-cols-2">
                <LoadingFrame className="h-72" />
                <LoadingFrame className="h-72" />
              </div>
            </>
          )}

          {variant === "split" && (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.85fr)]">
              <LoadingFrame className="h-[28rem]" />
              <LoadingFrame className="h-[28rem]" />
            </div>
          )}

          {variant === "cards" && (
            <div className="grid gap-4 xl:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <LoadingFrame key={index} className="h-48" />
              ))}
            </div>
          )}

          {variant === "profile" && (
            <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
              <LoadingFrame className="h-72" />
              <LoadingFrame className="h-80" />
            </div>
          )}
        </div>
      </PageLayoutContent>
    </PageLayout>
  )
}
