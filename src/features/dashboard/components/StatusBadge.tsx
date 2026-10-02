import { cn } from "@/lib/utils"
import { TONE_CLASSES } from "../constants"
import type { Tone } from "../types"

export function StatusBadge({ children, tone }: { children: string; tone: Tone }) {
  return <span className={cn("inline-flex h-[22px] shrink-0 items-center gap-1 rounded-full border px-2 text-[9px] font-semibold", TONE_CLASSES[tone])}><span className="size-1 rounded-full bg-current" />{children}</span>
}
