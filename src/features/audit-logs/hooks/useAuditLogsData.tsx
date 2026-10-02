import { useResourceData } from "@/features/_shared/resource/hooks/useResourceData"
import { MOCK_ROWS } from "../datas"

export function useAuditLogsData() {
  return useResourceData(MOCK_ROWS)
}
