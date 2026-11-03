type TableTimestampItem = {
  label: string
  value: string | null | undefined
  /** For nullable events such as a user who has never logged in. */
  emptyLabel?: string
}

type TableTimestampProps = {
  items: readonly TableTimestampItem[]
}

function formatTimestamp(value: string | null | undefined, emptyLabel = "—"): string {
  if (!value) return emptyLabel
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleString("vi-VN")
}

/** Consistent multi-line timestamp cells; only show timestamps returned by the API. */
export function TableTimestamp({ items }: TableTimestampProps) {
  return (
    <div className="type-micro space-y-1 whitespace-nowrap">
      {items.map(({ label, value, emptyLabel }) => (
        <p key={label}>
          <span className="font-medium text-foreground">{label}:</span>{" "}
          <span className="text-muted-foreground">{formatTimestamp(value, emptyLabel)}</span>
        </p>
      ))}
    </div>
  )
}
