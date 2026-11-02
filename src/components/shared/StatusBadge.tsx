import { STATUS_TONES } from "@/constants/components"
import { cn } from "@/lib/utils"
import type { StatusBadgeProps } from "@/types/components"

/** Hiển thị badge theo giá trị trạng thái gốc và nhãn do feature cung cấp. */
export function StatusBadge({ value, label }: StatusBadgeProps) {
  // Dữ liệu từ API có thể thiếu status khi backend và frontend chưa đồng bộ
  // phiên bản. Badge phải suy giảm an toàn thay vì làm sập toàn bộ route.
  const normalized = value?.trim().toUpperCase() ?? ""
  const displayLabel = label ?? (value ? value.replaceAll("_", " ") : "Unknown")
  const tone =
    normalized.includes("SUCCESS") ||
    normalized === "PASS" ||
    normalized === "COMPLETED" ||
    normalized === "ACTIVE" ||
    normalized === "CONNECTED" ||
    normalized === "READ"
      ? STATUS_TONES.success
      : normalized.includes("FAIL") ||
          normalized === "DISABLED" ||
          normalized === "DENIED" ||
          normalized === "ERROR" ||
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
        "inline-flex h-control-xs items-center gap-2 rounded-full border px-3 text-[12px]! leading-4! font-semibold tracking-wide",
        tone,
      )}
    >
      <span className="size-1 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {displayLabel}
    </span>
  )
}
