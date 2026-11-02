import { cn } from "@/lib/utils"

type TableIdentifierProps = {
  value: string | null | undefined
  /** Only the primary record ID is green; IDs pointing to related records are muted. */
  variant?: "primary" | "reference"
  fallback?: string
  inline?: boolean
  className?: string
}

/** Consistent record/foreign-key styling across all DataTables. */
export function TableIdentifier({
  value,
  variant = "primary",
  fallback = "—",
  inline = false,
  className,
}: TableIdentifierProps) {
  return (
    <span
      className={cn(
        "font-mono type-caption",
        inline ? "inline" : "block",
        value && variant === "primary" ? "text-identifier" : "text-muted-foreground",
        className,
      )}
      title={value || undefined}
    >
      {value || fallback}
    </span>
  )
}
