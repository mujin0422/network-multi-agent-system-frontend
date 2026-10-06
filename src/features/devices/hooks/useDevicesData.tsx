import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_DEVICES } from "../data"

export function useDevicesData() {
  const [query, setQuery] = useState("")
  const [brand, setBrand] = useState("ALL")
  const [category, setCategory] = useState("ALL")
  const filteredRows = useMemo(
    () =>
      MOCK_DEVICES.filter((device) => {
        const brandName =
          MOCK_BRANDS.find((item) => item.id === device.brand_id)?.name ?? ""
        const categoryName =
          MOCK_CATEGORIES.find((item) => item.id === device.category_id)
            ?.name ?? ""
        const matchQuery = [
          device.id,
          device.hostname,
          device.host,
          device.location ?? "",
          brandName,
          categoryName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())
        const matchBrand = brand === "ALL" || device.brand_id === brand
        const matchCategory =
          category === "ALL" || device.category_id === category

        return matchQuery && matchBrand && matchCategory
      }),
    [brand, category, query],
  )
  const pagination = useDataPagination(filteredRows)
  const brandName = (id: string) =>
    MOCK_BRANDS.find((item) => item.id === id)?.name ?? id
  const categoryName = (id: string) =>
    MOCK_CATEGORIES.find((item) => item.id === id)?.name ?? id
  return {
    query,
    rows: pagination.pageRows,
    pagination,
    brand,
    category,
    setQuery,
    setBrand,
    setCategory,
    brandName,
    categoryName,
  }
}
