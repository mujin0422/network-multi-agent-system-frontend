import type { Permission } from "../types/permission.type"

const FUNCTION_IDS = Array.from({ length: 8 }, (_, index) => `func-${String(index + 1).padStart(4, "0")}`)
const ACTION_IDS = Array.from({ length: 6 }, (_, index) => `acts-${String(index + 1).padStart(4, "0")}`)

export const MOCK_PERMISSIONS: Permission[] = FUNCTION_IDS.flatMap((functionId, functionIndex) =>
  ACTION_IDS.map((actionId, actionIndex) => ({
    id: `perm-${String(functionIndex * ACTION_IDS.length + actionIndex + 1).padStart(4, "0")}`,
    function_id: functionId,
    action_id: actionId,
  })),
)
