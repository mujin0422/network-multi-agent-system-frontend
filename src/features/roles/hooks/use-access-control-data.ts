import { useCallback, useEffect, useMemo, useState } from "react"
import { rolesApi } from "@/service"
import type { RoleCreate, RoleUpdate } from "@/service"
import { MOCK_FUNCTIONS } from "../mocks/management-functions.mock"
import { MOCK_ACTIONS } from "../mocks/actions.mock"
import { MOCK_PERMISSIONS } from "../mocks/permissions.mock"
import { MOCK_ROLE_PERMISSIONS } from "../mocks/role-permissions.mock"
import type { Role } from "../types/role.type"
import type { RolePermission } from "../types/role-permission.type"
import { findPermission } from "../utils/roles.util"

// Quản lý vai trò đang chọn và tập quyền được cấp cho vai trò đó.
export function useAccessControlData() {
  const [roles, setRoles] = useState<Role[]>([])
  const [activeRoleId, setActiveRoleId] = useState("")
  const [grants, setGrants] = useState<RolePermission[]>(() => [
    ...MOCK_ROLE_PERMISSIONS,
  ])
  const [draftGrants, setDraftGrants] = useState<RolePermission[]>(() => [
    ...MOCK_ROLE_PERMISSIONS,
  ])
  const reload = useCallback(async () => {
    const rows = await rolesApi.list()
    setRoles(rows)
    setActiveRoleId((current) => current && rows.some((role) => role.id === current) ? current : rows[0]?.id ?? "")
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reload() }, [reload])
  const createRole = useCallback(async (payload: RoleCreate) => { await rolesApi.create(payload); await reload() }, [reload])
  const updateRole = useCallback(async (id: string, payload: RoleUpdate) => { await rolesApi.update(id, payload); await reload() }, [reload])

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

    return new Set(draftGrants.filter(belongsToActiveRole).map(getPermissionId))
  }, [activeRoleId, draftGrants])

  const hasChanges = useMemo(() => {
    const savedPermissionIds = new Set(
      grants
        .filter((item) => item.role_id === activeRoleId)
        .map((item) => item.permission_id),
    )

    return (
      savedPermissionIds.size !== roleGrants.size ||
      [...savedPermissionIds].some(
        (permissionId) => !roleGrants.has(permissionId),
      )
    )
  }, [activeRoleId, grants, roleGrants])

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

    setDraftGrants(updateGrants)
  }

  // Bỏ bản nháp chưa lưu khi chuyển sang một vai trò khác.
  function selectRole(roleId: string) {
    setDraftGrants([...grants])
    setActiveRoleId(roleId)
  }

  // Xác nhận toàn bộ thay đổi quyền của vai trò đang chọn.
  function saveChanges() {
    if (activeRoleId === "role-0001" || !hasChanges) return
    setGrants([...draftGrants])
  }

  return {
    activeRoleId,
    actions: MOCK_ACTIONS,
    functions: MOCK_FUNCTIONS,
    permissions: MOCK_PERMISSIONS,
    roles,
    roleGrants,
    hasChanges,
    selectRole,
    saveChanges,
    toggle,
    createRole,
    updateRole,
  }
}
