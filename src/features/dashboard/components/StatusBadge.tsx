import { cn } from "@/lib/utils"
import { TONE_CLASSES } from "../constants/dashboard.constants"
import type { Tone } from "../types/tone.type"

/** Badge trạng thái gọn dùng riêng cho các hoạt động trên dashboard. */
export function StatusBadge({
  children,
  tone,
}: {
  children: string
  tone: Tone
}) {
  return (
    <span
      className={cn(
        "inline-flex h-control-xs shrink-0 items-center gap-2 rounded-full border px-3 text-[12px]! leading-4! font-semibold",
        TONE_CLASSES[tone],
      )}
    >
      <span className="size-1 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}
