"use client"

import {
  createContext,
  isValidElement,
  useContext,
  useState,
  type ReactNode,
} from "react"
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDataTable } from "@/hooks/use-data-table"
import { cn } from "@/lib/utils"
import type {
  DataTableContentProps,
  DataTableContextValue,
  DataTableFilterOption,
  DataTableFilterProps,
  DataTableFiltersProps,
  DataTablePanelProps,
  DataTablePaginationProps,
  DataTableProps,
  DataTableSearchProps,
  DataTableToolbarActionsProps,
  DataTableToolbarProps,
  ResolvedDataTableColumn,
  ResolvedDataTableFilter,
} from "@/types/shared/data-table.types"

const DataTableContext = createContext<DataTableContextValue | null>(null)

function useDataTableContext() {
  const context = useContext(DataTableContext)
  if (!context)
    throw new Error("DataTable components must be used inside DataTable")
  return context
}

function renderCellValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "")
    return <span className="text-muted-foreground">—</span>
  if (Array.isArray(value))
    return (
      <div className="flex flex-col gap-1">
        {value.map((line, index) => (
          <span key={`${String(line)}-${index}`}>{String(line)}</span>
        ))}
      </div>
    )
  if (isValidElement(value)) return value
  return String(value)
}

function getCellContent(
  row: Record<PropertyKey, unknown>,
  column: ResolvedDataTableColumn,
) {
  if (column.cell) return column.cell(row)
  if (column.accessorKey) return renderCellValue(row[column.accessorKey])
  return <span className="text-muted-foreground">—</span>
}

/** Cung cấp dữ liệu, tìm kiếm, bộ lọc và phân trang cho toàn bộ compound table. */
function DataTable<TData>({
  data,
  columns,
  filters = [],
  getRowId,
  searchValue,
  selectedRowId,
  onRowClick,
  initialPageSize = 10,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const table = useDataTable({
    data,
    columns,
    filters,
    initialPageSize,
    searchValue,
  })
  const context: DataTableContextValue = {
    columns: columns as unknown as readonly ResolvedDataTableColumn[],
    filters: filters as unknown as readonly ResolvedDataTableFilter[],
    paginatedData: table.paginatedData as readonly Record<
      PropertyKey,
      unknown
    >[],
    filteredItemCount: table.filteredData.length,
    filterValues: table.filterValues,
    searchQuery: table.searchQuery,
    currentPage: table.currentPage,
    pageSize: table.pageSize,
    startIndex: table.startIndex,
    startItem: table.startItem,
    endItem: table.endItem,
    pageItems: table.pageItems,
    canGoPrevious: table.canGoPrevious,
    canGoNext: table.canGoNext,
    hasActiveFilters: table.hasActiveFilters,
    allFiltersValue: table.allFiltersValue,
    selectedRowId,
    getRowId: (row, index) =>
      getRowId ? getRowId(row as TData, index) : String(index),
    onRowClick: onRowClick ? (row) => onRowClick(row as TData) : undefined,
    setSearchQuery: table.setSearchQuery,
    setFilterValue: table.setFilterValue,
    resetFilters: table.resetFilters,
    setPageSize: table.setPageSize,
    goToPage: table.goToPage,
    goToPreviousPage: table.goToPreviousPage,
    goToNextPage: table.goToNextPage,
  }

  return (
    <DataTableContext.Provider value={context}>
      <section
        data-slot="data-table"
        className={cn("flex min-w-0 flex-col gap-4", className)}
        {...props}
      >
        {children}
      </section>
    </DataTableContext.Provider>
  )
}

function DataTablePanel({ className, ...props }: DataTablePanelProps) {
  return (
    <div
      data-slot="data-table-panel"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

function DataTableToolbar({ className, ...props }: DataTableToolbarProps) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn(
        "flex flex-col gap-3 border-b border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
      {...props}
    />
  )
}

function DataTableToolbarActions({ className, ...props}: DataTableToolbarActionsProps) {
  return (
    <div
      data-slot="data-table-toolbar-actions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

/** Ô tìm kiếm được điều khiển trực tiếp bởi DataTable context. */
function DataTableSearch({
  className,
  placeholder = "Search...",
  ...props
}: DataTableSearchProps) {
  const { t } = useTranslation()
  const table = useDataTableContext()
  const translatedPlaceholder = t(placeholder, { defaultValue: placeholder })

  return (
    <div data-slot="data-table-search" className="relative w-full lg:max-w-md">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        {...props}
        type="search"
        value={table.searchQuery}
        onChange={(event) => table.setSearchQuery(event.target.value)}
        placeholder={translatedPlaceholder}
        aria-label={props["aria-label"] ?? translatedPlaceholder}
        className={cn(
          "pr-9 pl-9 text-xs md:text-xs placeholder:text-xs [&::-webkit-search-cancel-button]:hidden",
          className,
        )}
      />
      {table.searchQuery.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => table.setSearchQuery("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2"
        >
          <XIcon aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

/** Một bộ lọc được dựng từ cấu hình đã đăng ký trong DataTable. */
function DataTableFilter({ filterId, className }: DataTableFilterProps) {
  const { t } = useTranslation()
  const table = useDataTableContext()
  const filter = table.filters.find((candidate) => candidate.id === filterId)
  if (!filter) return null

  const options: DataTableFilterOption[] = [
    {
      value: table.allFiltersValue,
      label: t(filter.allLabel ?? `All ${filter.label}`, {
        defaultValue: filter.allLabel ?? `All ${filter.label}`,
      }),
    },
    ...filter.options.map((option) => ({
      ...option,
      label: t(option.label, { defaultValue: option.label }),
    })),
  ]
  const selectedValue = table.filterValues[filter.id] ?? table.allFiltersValue

  return (
    <Combobox
      items={options}
      // Status filters without a search input should always show every option.
      // Base UI otherwise retains its internal input query after selection.
      filter={filter.searchable ? undefined : null}
      value={selectedValue}
      onValueChange={(value) => value && table.setFilterValue(filter.id, value)}
    >
      <ComboboxTrigger
        aria-label={t(filter.label, { defaultValue: filter.label })}
        className={cn(
          "flex h-9 min-w-40 items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-xs text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
      >
        <ComboboxValue>
          {(value) =>
            options.find((option) => option.value === value)?.label ??
            filter.label
          }
        </ComboboxValue>
      </ComboboxTrigger>
      <ComboboxContent>
        {filter.searchable && (
          <ComboboxInput
            placeholder={filter.searchPlaceholder ?? filter.label}
            showTrigger={false}
            className="
                [&_input]:!text-xs
                [&_input::placeholder]:!text-xs
                !outline-none
                !ring-0
                !ring-offset-0
                focus:!outline-none
                focus:!ring-0
                focus-visible:!outline-none
                focus-visible:!ring-0
                focus-within:!outline-none
                focus-within:!ring-0
                focus-within:!border-input
                [&_input:focus]:!outline-none
                [&_input:focus-visible]:!outline-none
              "
          />
        )}
        <ComboboxEmpty>
          {filter.emptyMessage ?? "No results found."}
        </ComboboxEmpty>
        <ComboboxList>
          {(option: DataTableFilterOption) => (
            <ComboboxItem
              value={option.value}
              className="text-xs"
            >
              <div className="min-w-0">
                <p className="truncate">{option.label}</p>
                {option.description && (
                  <p className="truncate font-mono type-caption text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

/** Tự động dựng toàn bộ filters và nút reset. */
function DataTableFilters({ className, ...props }: DataTableFiltersProps) {
  const table = useDataTableContext()
  if (table.filters.length === 0) return null

  return (
    <div
      data-slot="data-table-filters"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {table.filters.map((filter) => (
        <DataTableFilter key={filter.id} filterId={filter.id} />
      ))}
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={!table.hasActiveFilters}
        onClick={table.resetFilters}
        aria-label="Reset filters"
        title="Reset filters"
        className="bg-background"
      >
        <RotateCcwIcon aria-hidden="true" />
      </Button>
    </div>
  )
}


type DataTableDateRangeFilterProps = {
  value?: DateRange
  onChange: (next: DateRange | undefined) => void
  className?: string
  disabled?: boolean
}

function localDateAtTime(day: Date, time: string, end = false): Date {
  const [hour, minute] = time.split(":").map(Number)
  return new Date(
    day.getFullYear(), day.getMonth(), day.getDate(),
    hour, minute, end ? 59 : 0, end ? 999 : 0,
  )
}

/** Shared shadcn Base Date/Time range control for DataTable toolbars. */
function DataTableDateRangeFilter({
  value,
  onChange,
  className,
  disabled,
}: DataTableDateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  const fromTime = value?.from ? format(value.from, "HH:mm") : "00:00"
  const toTime = value?.to ? format(value.to, "HH:mm") : "23:59"

  const dateLabel = value?.from
    ? value.to
      ? `${format(value.from, "dd/MM/yyyy")} – ${format(value.to, "dd/MM/yyyy")}`
      : format(value.from, "dd/MM/yyyy")
    : "Date range"

  function selectDates(range: DateRange | undefined) {
    if (!range?.from) {
      onChange(undefined)
      return
    }
    const from = localDateAtTime(range.from, fromTime)
    const to = range.to ? localDateAtTime(range.to, toTime, true) : undefined
    onChange({ from, to })
  }

  function selectStartTime(time: string) {
    if (!value?.from || !/^([01]\\d|2[0-3]):[0-5]\\d$/.test(time)) return
    const from = localDateAtTime(value.from, time)
    const to = value.to && value.to < from
      ? localDateAtTime(value.to, time, true)
      : value.to
    onChange({ from, to })
  }

  function selectEndTime(time: string) {
    if (!value?.from || !/^([01]\\d|2[0-3]):[0-5]\\d$/.test(time)) return
    const to = localDateAtTime(value.to ?? value.from, time, true)
    const from = value.from > to
      ? localDateAtTime(value.from, time)
      : value.from
    onChange({ from, to })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className={cn(
              "h-9 min-w-40 justify-start gap-2 bg-background text-xs font-normal",
              !value?.from && "text-muted-foreground",
              className,
            )}
            aria-label="Filter audit events by date and time range"
          />
        }
      >
        <CalendarDaysIcon aria-hidden="true" className="size-4" />
        <span>{dateLabel}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto max-w-[calc(100vw-1rem)] p-0">
        <Calendar
          mode="range"
          numberOfMonths={1}
          selected={value}
          onSelect={selectDates}
          className="mx-auto"
        />
        <div className="grid grid-cols-2 gap-2 border-t border-border px-3 py-3">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            From time
            <Input
              type="time"
              value={fromTime}
              disabled={!value?.from}
              onChange={(event) => selectStartTime(event.target.value)}
              className="h-8 text-xs"
              aria-label="From time"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            To time
            <Input
              type="time"
              value={toTime}
              disabled={!value?.from}
              onChange={(event) => selectEndTime(event.target.value)}
              className="h-8 text-xs"
              aria-label="To time"
            />
          </label>
        </div>
        <div className="flex justify-between gap-2 border-t border-border p-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={!value?.from}
            onClick={() => onChange(undefined)}
          >
            Clear dates
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** Header, hàng dữ liệu và empty state của bảng. */
function DataTableContent({
  emptyMessage = "common.noResults",
  className,
}: DataTableContentProps) {
  const { t } = useTranslation()
  const table = useDataTableContext()

  return (
    <div className="overflow-x-auto">
      <Table
        data-slot="data-table-content"
        className={cn("min-w-full", className)}
      >
        <TableHeader className="bg-card">
          <TableRow className="hover:bg-transparent">
            {table.columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  "h-11 px-4 text-xs font-semibold uppercase tracking-wide text-foreground",
                  column.headerClassName,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.paginatedData.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={Math.max(table.columns.length, 1)}
                className="h-32 px-4 text-center text-muted-foreground"
              >
                {t(emptyMessage)}
              </TableCell>
            </TableRow>
          )}
          {table.paginatedData.map((row, rowIndex) => {
            const rowId = table.getRowId(row, table.startIndex + rowIndex)
            const clickable = Boolean(table.onRowClick)
            return (
              <TableRow
                key={rowId}
                tabIndex={clickable ? 0 : undefined}
                aria-selected={table.selectedRowId === rowId}
                className={cn(
                  clickable &&
                    "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  table.selectedRowId === rowId && "bg-muted/50",
                )}
                onClick={() => table.onRowClick?.(row)}
                onKeyDown={(event) => {
                  if (
                    !clickable ||
                    (event.key !== "Enter" && event.key !== " ")
                  )
                    return
                  event.preventDefault()
                  table.onRowClick?.(row)
                }}
              >
                {table.columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={cn(
                      "px-4 py-3 text-left align-middle whitespace-normal",
                      column.className,
                    )}
                  >
                    {getCellContent(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

/** Kết quả, page size và điều hướng trang dùng chung context. */
function DataTablePagination({
  itemLabel = "items",
  pageSizeOptions = [5, 10, 20, 50],
  className,
  ...props
}: DataTablePaginationProps) {
  const { t, i18n } = useTranslation()
  const table = useDataTableContext()

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-col gap-4 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {table.startItem.toLocaleString(i18n.language)}–
        {table.endItem.toLocaleString(i18n.language)}{" "}
        {t("common.of", { defaultValue: "of" })}{" "}
        {table.filteredItemCount.toLocaleString(i18n.language)}{" "}
        {t(itemLabel, { defaultValue: itemLabel })}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {pageSizeOptions.length > 1 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {t("common.rowsPerPage", { defaultValue: "Rows per page" })}
            </span>
            <Combobox
              // Page-size choices are a fixed list, not a searchable combobox.
              filter={null}
              value={String(table.pageSize)}
              onValueChange={(value) =>
                value && table.setPageSize(Number(value))
              }
            >
              <ComboboxTrigger
                aria-label="Rows per page"
                className="flex h-8 w-20 items-center justify-between rounded-lg border bg-background px-2"
              >
                <ComboboxValue />
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxList>
                  {pageSizeOptions.map((option) => (
                    <ComboboxItem key={option} value={String(option)} className="text-xs">
                      {option}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        )}
        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-disabled={!table.canGoPrevious}
                tabIndex={table.canGoPrevious ? 0 : -1}
                onClick={(event) => {
                  event.preventDefault()
                  table.goToPreviousPage()
                }}
                className={cn(
                  "size-8 gap-1 p-0 sm:w-auto sm:px-3",
                  !table.canGoPrevious && "pointer-events-none opacity-50",
                )}
              >
                <ChevronLeftIcon />
                <span className="hidden text-xs sm:inline">{t("common.previous")}</span>
              </PaginationLink>
            </PaginationItem>
            {table.pageItems.map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="size-8" />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === table.currentPage}
                    size="icon-sm"
                    className="text-xs"
                    onClick={(event) => {
                      event.preventDefault()
                      table.goToPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-disabled={!table.canGoNext}
                tabIndex={table.canGoNext ? 0 : -1}
                onClick={(event) => {
                  event.preventDefault()
                  table.goToNextPage()
                }}
                className={cn(
                  "size-8 gap-1 p-0 sm:w-auto sm:px-3",
                  !table.canGoNext && "pointer-events-none opacity-50",
                )}
              >
                <span className="hidden text-xs sm:inline">{t("common.next")}</span>
                <ChevronRightIcon />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export {
  DataTable,
  DataTableContent,
  DataTableDateRangeFilter,
  DataTableFilter,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
}
