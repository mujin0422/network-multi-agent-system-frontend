import { useMemo } from "react"
import { MOCK_DEVICE_BRANDS } from "../mocks/device-brands.mock"
import { MOCK_DEVICE_CATEGORIES } from "../mocks/device-categories.mock"
import { MOCK_DEVICE_AUDIT_USERS } from "../mocks/device-audit-users.mock"
import { MOCK_DEVICES } from "../mocks/devices.mock"
import { catalogName } from "../utils/devices.util"

// Quản lý tìm kiếm, bộ lọc và phân trang danh sách thiết bị.
export function useDevicesData() {
  // Trả về tên thương hiệu theo mã, hoặc chính mã đó nếu không tìm thấy.
  function brandName(id: string) {
    // Kiểm tra thương hiệu có mã trùng với mã cần tìm hay không.
    return catalogName(MOCK_DEVICE_BRANDS, id)
  }

  // Trả về tên danh mục theo mã, hoặc chính mã đó nếu không tìm thấy.
  function categoryName(id: string) {
    // Kiểm tra danh mục có mã trùng với mã cần tìm hay không.
    return catalogName(MOCK_DEVICE_CATEGORIES, id)
  }

  // Tra cứu tên người tạo/cập nhật từ dữ liệu người dùng mock của feature.
  function auditUserName(id: string) {
    return (
      MOCK_DEVICE_AUDIT_USERS.find((user) => user.id === id)?.full_name ?? id
    )
  }
  const summary = useMemo(() => ({
    total: MOCK_DEVICES.length,
    routers: MOCK_DEVICES.filter((device) => device.category_id === "catg-0001").length,
    switches: MOCK_DEVICES.filter((device) => device.category_id === "catg-0002").length,
    deviceTypes: new Set(MOCK_DEVICES.map((device) => device.device_type)).size,
  }), [])
  return {
    rows: MOCK_DEVICES,
    brandName,
    categoryName,
    auditUserName,
    brands: MOCK_DEVICE_BRANDS,
    categories: MOCK_DEVICE_CATEGORIES,
    summary,
  }
}
