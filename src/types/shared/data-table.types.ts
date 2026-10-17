import type { ComponentProps, ReactNode } from "react"

export type DataTableColumn<TData> = {
  id: string
  header: ReactNode
  accessorKey?: keyof TData
  cell?: (row: TData) => ReactNode
  headerClassName?: string
  className?: string
}

export type DataTableFilterOption = {
  value: string
  label: string
  description?: string
}

export type DataTableFilterDefinition<TData> = {
  id: string
  label: string
  accessorKey: keyof TData
  options: readonly DataTableFilterOption[]
  allLabel?: string
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
}

export type DataTableProps<TData> = Omit<ComponentProps<"section">, "children"> & {
  data: readonly TData[]
  columns: readonly DataTableColumn<TData>[]
  filters?: readonly DataTableFilterDefinition<TData>[]
  getRowId?: (row: TData, index: number) => string
  searchValue?: (row: TData) => string
  selectedRowId?: string
  onRowClick?: (row: TData) => void
  initialPageSize?: number
  children: ReactNode
}

export type ResolvedDataTableColumn = DataTableColumn<Record<PropertyKey, unknown>>
export type ResolvedDataTableFilter = DataTableFilterDefinition<Record<PropertyKey, unknown>>

export type DataTableContextValue = {
  columns: readonly ResolvedDataTableColumn[]
  filters: readonly ResolvedDataTableFilter[]
  paginatedData: readonly Record<PropertyKey, unknown>[]
  filteredItemCount: number
  filterValues: Record<string, string>
  searchQuery: string
  currentPage: number
  pageSize: number
  startIndex: number
  startItem: number
  endItem: number
  pageItems: readonly (number | "ellipsis")[]
  canGoPrevious: boolean
  canGoNext: boolean
  hasActiveFilters: boolean
  allFiltersValue: string
  selectedRowId?: string
  getRowId: (row: Record<PropertyKey, unknown>, index: number) => string
  onRowClick?: (row: Record<PropertyKey, unknown>) => void
  setSearchQuery: (query: string) => void
  setFilterValue: (id: string, value: string) => void
  resetFilters: () => void
  setPageSize: (size: number) => void
  goToPage: (page: number) => void
  goToPreviousPage: () => void
  goToNextPage: () => void
}

export type DataTablePanelProps = ComponentProps<"div">
export type DataTableToolbarProps = ComponentProps<"div">
export type DataTableToolbarActionsProps = ComponentProps<"div">
export type DataTableFiltersProps = ComponentProps<"div">
export type DataTableSearchProps = Omit<ComponentProps<"input">, "value" | "onChange" | "type">
export type DataTableFilterProps = { filterId: string; className?: string }
export type DataTableContentProps = { emptyMessage?: string; className?: string }
export type DataTablePaginationProps = ComponentProps<"div"> & {
  itemLabel?: string
  pageSizeOptions?: readonly number[]
}
