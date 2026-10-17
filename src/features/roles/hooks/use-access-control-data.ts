import { useMemo, useState } from "react"
import { MOCK_FUNCTIONS } from "../mocks/management-functions.mock"
import { MOCK_ACTIONS } from "../mocks/actions.mock"
import { MOCK_PERMISSIONS } from "../mocks/permissions.mock"
import { MOCK_ROLE_PERMISSIONS } from "../mocks/role-permissions.mock"
import { MOCK_ROLES } from "../mocks/roles.mock"
import type { RolePermission } from "../types/role-permission.type"
import { findPermission } from "../utils/roles.util"

// Quản lý vai trò đang chọn và tập quyền được cấp cho vai trò đó.
export function useAccessControlData() {
  const [activeRoleId, setActiveRoleId] = useState(MOCK_ROLES[1].id)
  const [grants, setGrants] = useState(MOCK_ROLE_PERMISSIONS)

  // Tạo tập mã quyền của vai trò đang được chọn.
  const roleGrants = useMemo(function createRoleGrants() {
    // Kiểm tra một bản ghi quyền có thuộc vai trò đang chọn hay không.
    function belongsToActiveRole(item: RolePermission) {
      return item.role_id === activeRoleId
    }

    // Lấy mã quyền từ bản ghi liên kết vai trò và quyền.
    function getPermissionId(item: RolePermission) {
      return item.permission_id
    }

    return new Set(grants.filter(belongsToActiveRole).map(getPermissionId))
  }, [activeRoleId, grants])

  // Thêm hoặc gỡ quyền tương ứng với chức năng và hành động được chọn.
  function toggle(functionId: string, actionId: string) {
    const permission = findPermission(MOCK_PERMISSIONS, functionId, actionId)
    if (!permission || activeRoleId === "role-0001") return
    const permissionId = permission.id

    // Tạo danh sách quyền mới dựa trên trạng thái cấp quyền hiện tại.
    function updateGrants(current: RolePermission[]) {
      if (roleGrants.has(permissionId)) {
        // Giữ lại các quyền không trùng với quyền cần gỡ.
        function isDifferentGrant(item: RolePermission) {
          return !(
            item.role_id === activeRoleId &&
            item.permission_id === permissionId
          )
        }

        return current.filter(isDifferentGrant)
      }

      return [
        ...current,
        { role_id: activeRoleId, permission_id: permissionId },
      ]
    }

    setGrants(updateGrants)
  }
  return { activeRoleId, actions: MOCK_ACTIONS, functions: MOCK_FUNCTIONS, permissions: MOCK_PERMISSIONS, roles: MOCK_ROLES, roleGrants, setActiveRoleId, toggle }
}
