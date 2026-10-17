import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function SettingRow({
  icon,
  title,
  description,
  children,
  last = false,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
  last?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center",
        !last && "border-b",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-semibold">{title}</h2>
          <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0 pl-10 sm:pl-0">{children}</div>
    </div>
  )
}
