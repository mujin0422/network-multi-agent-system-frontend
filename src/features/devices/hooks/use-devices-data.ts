import { useMemo, useState } from "react"
import { useDataPagination } from "@/hooks/use-data-pagination"
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_DEVICES } from "../data"
import type { Brand, Category, Device } from "../types"

// Quản lý tìm kiếm, bộ lọc và phân trang danh sách thiết bị.
export function useDevicesData() {
  const [query, setQuery] = useState("")
  const [brand, setBrand] = useState("ALL")
  const [category, setCategory] = useState("ALL")

  // Lọc danh sách thiết bị theo các điều kiện hiện tại.
  const filteredRows = useMemo(function filterRows() {
    // Kiểm tra thiết bị có khớp từ khóa, thương hiệu và danh mục hay không.
    function matchesFilters(device: Device) {
      const matchQuery = [
        device.id,
        device.hostname,
        device.host,
        device.location ?? "",
        brandName(device.brand_id),
        categoryName(device.category_id),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase())
      const matchBrand = brand === "ALL" || device.brand_id === brand
      const matchCategory =
        category === "ALL" || device.category_id === category

      return matchQuery && matchBrand && matchCategory
    }

    return MOCK_DEVICES.filter(matchesFilters)
  }, [brand, category, query])
  const pagination = useDataPagination(filteredRows)

  // Trả về tên thương hiệu theo mã, hoặc chính mã đó nếu không tìm thấy.
  function brandName(id: string) {
    // Kiểm tra thương hiệu có mã trùng với mã cần tìm hay không.
    function matchesBrand(item: Brand) {
      return item.id === id
    }

    return MOCK_BRANDS.find(matchesBrand)?.name ?? id
  }

  // Trả về tên danh mục theo mã, hoặc chính mã đó nếu không tìm thấy.
  function categoryName(id: string) {
    // Kiểm tra danh mục có mã trùng với mã cần tìm hay không.
    function matchesCategory(item: Category) {
      return item.id === id
    }

    return MOCK_CATEGORIES.find(matchesCategory)?.name ?? id
  }
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
