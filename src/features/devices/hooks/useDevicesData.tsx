import { useResourceData } from "@/features/_shared/resource/hooks/useResourceData"
import { MOCK_ROWS } from "../datas"

export function useDevicesData() {
  return useResourceData(MOCK_ROWS)
}
