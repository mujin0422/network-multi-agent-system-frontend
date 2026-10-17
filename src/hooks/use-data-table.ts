import { useMemo, useState } from "react"

import type { DataTableColumn, DataTableFilterDefinition } from "@/types/shared/data-table.types"

const ALL_FILTERS_VALUE = "__all__"

function createPageItems(currentPage: number, pageCount: number): readonly (number | "ellipsis")[] {
  const visiblePages = Array.from({ length: pageCount }, (_, index) => index + 1).filter((page) => page === 1 || page === pageCount || Math.abs(page - currentPage) <= 1)

  return visiblePages.flatMap((page, index) => index > 0 && page - visiblePages[index - 1] > 1 ? ["ellipsis" as const, page] : [page])
}

export function useDataTable<TData>({ data, columns, filters, initialPageSize, searchValue }: {
  data: readonly TData[]
  columns: readonly DataTableColumn<TData>[]
  filters: readonly DataTableFilterDefinition<TData>[]
  initialPageSize: number
  searchValue?: (row: TData) => string
}) {
  const [searchQuery, setSearchQueryState] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [requestedPage, setRequestedPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const filteredData = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

    return data.filter((row) => {
      const searchableText = searchValue ? searchValue(row) : columns.map((column) => column.accessorKey ? String(row[column.accessorKey] ?? "") : "").join(" ")
      const matchesSearch = !normalizedQuery || searchableText.toLocaleLowerCase().includes(normalizedQuery)
      const matchesFilters = filters.every((filter) => {
        const selectedValue = filterValues[filter.id] ?? ALL_FILTERS_VALUE
        return selectedValue === ALL_FILTERS_VALUE || String(row[filter.accessorKey] ?? "") === selectedValue
      })

      return matchesSearch && matchesFilters
    })
  }, [columns, data, filterValues, filters, searchQuery, searchValue])

  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const currentPage = Math.min(requestedPage, pageCount)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)
  const startItem = filteredData.length === 0 ? 0 : startIndex + 1
  const endItem = Math.min(startIndex + pageSize, filteredData.length)

  function setSearchQuery(query: string) {
    setSearchQueryState(query)
    setRequestedPage(1)
  }

  function setFilterValue(id: string, value: string) {
    setFilterValues((current) => ({ ...current, [id]: value }))
    setRequestedPage(1)
  }

  function resetFilters() {
    setSearchQueryState("")
    setFilterValues({})
    setRequestedPage(1)
  }

  function setPageSize(size: number) {
    setPageSizeState(Math.max(1, size))
    setRequestedPage(1)
  }

  function goToPage(page: number) {
    setRequestedPage(Math.min(Math.max(1, page), pageCount))
  }

  return {
    paginatedData,
    filteredData,
    filterValues,
    searchQuery,
    currentPage,
    pageSize,
    startIndex,
    startItem,
    endItem,
    pageItems: createPageItems(currentPage, pageCount),
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < pageCount,
    hasActiveFilters: Boolean(searchQuery) || Object.values(filterValues).some((value) => value !== ALL_FILTERS_VALUE),
    allFiltersValue: ALL_FILTERS_VALUE,
    setSearchQuery,
    setFilterValue,
    resetFilters,
    setPageSize,
    goToPage,
    goToPreviousPage: () => goToPage(currentPage - 1),
    goToNextPage: () => goToPage(currentPage + 1),
  }
}
