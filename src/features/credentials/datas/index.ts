import { DEFAULT_RESOURCE_ROWS } from "@/features/_shared/resource/datas"
import type { ResourceRow } from "../types"

export const MOCK_ROWS: ResourceRow[] = DEFAULT_RESOURCE_ROWS.map((row, index) =>
  index === 0 ? { ...row, name: "Credentials credential" } : { ...row }
)
