import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
} from "@/components/shared/PageLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type PageLoadingVariant = "table" | "dashboard" | "split" | "cards" | "profile"

type PageLoadingSkeletonProps = {
  title: string
  description?: string
  stats?: number
  variant?: PageLoadingVariant
}

/** Placeholder dùng chung, giữ nguyên bố cục trang trong khi tải dữ liệu API. */
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
            <Card key={index} className="gap-0 py-0">
              <CardContent className="flex min-h-24 items-center justify-between gap-4 p-4">
                <div className="flex flex-1 flex-col gap-3">
                  <Skeleton className="h-3 w-24 max-w-full" />
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-3 w-32 max-w-full" />
                </div>
                <Skeleton className="size-9 shrink-0 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </PageLayoutOverview>
      )}
      <PageLayoutContent>
        <div
          role="status"
          aria-busy="true"
          aria-label="Loading page content"
          className="space-y-4"
        >
          <span className="sr-only">Loading page content...</span>
          {variant === "table" && <TableLoadingSkeleton />}
          {variant === "dashboard" && <DashboardLoadingSkeleton />}
          {variant === "split" && (
            <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
              <Card className="p-4">
                <Skeleton className="mb-5 h-9 w-3/4" />
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="mb-3 h-9 w-full" />
                ))}
              </Card>
              <Card className="space-y-5 p-4">
                <Skeleton className="h-7 w-1/2" />
                {Array.from({ length: 7 }, (_, index) => (
                  <Skeleton key={index} className="h-7 w-full" />
                ))}
              </Card>
            </div>
          )}
          {variant === "cards" && (
            <div className="grid gap-4 xl:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Card key={index} className="space-y-4 p-5">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          )}
          {variant === "profile" && (
            <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
              <Card className="flex items-center gap-4 p-6 lg:flex-col">
                <Skeleton className="size-20 shrink-0 rounded-full" />
                <div className="w-full space-y-3">
                  <Skeleton className="mx-auto h-5 w-3/4" />
                  <Skeleton className="mx-auto h-4 w-4/5" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </Card>
              <Card className="space-y-5 p-6">
                <Skeleton className="h-6 w-1/3" />
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      </PageLayoutContent>
    </PageLayout>
  )
}

function TableLoadingSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <Skeleton className="h-9 w-full max-w-72" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="space-y-0">
        <div className="flex gap-5 border-b bg-muted/30 px-4 py-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-3 flex-1" />
          ))}
        </div>
        {Array.from({ length: 6 }, (_, rowIndex) => (
          <div key={rowIndex} className="flex gap-5 border-b px-4 py-4 last:border-b-0">
            {Array.from({ length: 5 }, (_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={`h-4 flex-1 ${columnIndex === 0 ? "max-w-36" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t p-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-40" />
      </div>
    </Card>
  )
}

function DashboardLoadingSkeleton() {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="space-y-4 p-5">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-44 w-full rounded-lg" />
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Card key={index} className="space-y-4 p-5">
            <Skeleton className="h-5 w-1/3" />
            {Array.from({ length: 4 }, (_, rowIndex) => (
              <Skeleton key={rowIndex} className="h-9 w-full" />
            ))}
          </Card>
        ))}
      </div>
    </>
  )
}
