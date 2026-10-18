import { STATUS_TONES } from "@/constants/components"
import { cn } from "@/lib/utils"
import type { StatusBadgeProps } from "@/types/components"

/** Hiển thị badge theo giá trị trạng thái gốc và nhãn do feature cung cấp. */
export function StatusBadge({ value, label }: StatusBadgeProps) {
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
        "inline-flex h-control-xs items-center gap-2 rounded-full border px-3 text-[12px]! leading-4! font-semibold tracking-wide",
        tone,
      )}
    >
      <span className="size-1 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {label ?? value.replaceAll("_", " ")}
    </span>
  )
}
