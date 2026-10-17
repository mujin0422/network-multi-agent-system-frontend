import { useTranslation } from "react-i18next"

import { STATUS_TONES } from "@/constants/components"
import { cn } from "@/lib/utils"
import type { StatusBadgeProps } from "@/types/components"

/** Chuẩn hóa trạng thái thành badge có màu sắc và nhãn đã được dịch. */
export function StatusBadge({ value }: StatusBadgeProps) {
  const { t } = useTranslation()
  const normalized = value.toUpperCase()
  const tone =
    normalized.includes("SUCCESS") ||
    normalized === "ACTIVE" ||
    normalized === "CONNECTED" ||
    normalized === "READ"
      ? STATUS_TONES.success
      : normalized.includes("FAIL") ||
          normalized === "DISABLED" ||
          normalized === "REJECTED" ||
          normalized === "WRITE"
        ? STATUS_TONES.danger
        : normalized.includes("RUNNING") || normalized === "PLANNING"
          ? STATUS_TONES.info
          : normalized.includes("WAIT") || normalized === "PENDING"
            ? STATUS_TONES.warning
            : STATUS_TONES.neutral

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-[9px] font-semibold tracking-wide",
        tone,
      )}
    >
      {t(`status.${normalized}`, { defaultValue: value.replaceAll("_", " ") })}
    </span>
  )
}
