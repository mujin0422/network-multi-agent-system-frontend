import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

type DataPaginationProps = {
  page: number
  pageCount: number
  pageSize: number
  totalRows: number
  onPageChange: (page: number) => void
}

/** Hiển thị khoảng dữ liệu hiện tại và điều hướng giữa các trang. */
export function DataPagination({
  page,
  pageCount,
  pageSize,
  totalRows,
  onPageChange,
}: DataPaginationProps) {
  const { t } = useTranslation()
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalRows)

  // Luôn giữ trang đầu, trang cuối và các trang lân cận trang hiện tại.
  const visiblePages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === pageCount || Math.abs(item - page) <= 1,
  )

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[10px] text-muted-foreground">
        {t("common.pagination", { start, end, total: totalRows, pageSize })}
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text={t("common.previous")}
              aria-disabled={page === 1}
              className={cn("h-8 text-xs", page === 1 && "pointer-events-none opacity-40")}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(Math.max(1, page - 1))
              }}
            />
          </PaginationItem>
          {visiblePages.map((item, index) => (
            <PaginationItem key={item} className="flex items-center">
              {index > 0 && item - visiblePages[index - 1] > 1 && <PaginationEllipsis />}
              <PaginationLink
                href="#"
                size="icon-sm"
                isActive={item === page}
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(item)
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              text={t("common.next")}
              aria-disabled={page === pageCount}
              className={cn(
                "h-8 text-xs",
                page === pageCount && "pointer-events-none opacity-40",
              )}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(Math.min(pageCount, page + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
