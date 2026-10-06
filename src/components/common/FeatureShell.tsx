import type { LucideIcon } from "lucide-react"
import { Search } from "lucide-react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { Card, CardContent } from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type FeatureHeaderProps = {
  title: string
  description: string
  action?: ReactNode
  secondaryAction?: ReactNode
}

/** Tiêu đề chuẩn của một feature page cùng khu vực chứa các nút hành động. */
export function FeatureHeader({
  title,
  description,
  action,
  secondaryAction,
}: FeatureHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2">
          {secondaryAction}
          {action}
        </div>
      )}
    </header>
  )
}

type StatCardProps = {
  label: string
  value: string | number
  detail: string
  icon: LucideIcon
  tone?: "blue" | "green" | "amber" | "red" | "violet"
}

/** Card tóm tắt một chỉ số với icon và màu nhấn theo `tone`. */
export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "blue",
}: StatCardProps) {
  const tones = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    red: "bg-red-500/10 text-red-400",
    violet: "bg-violet-500/10 text-violet-400",
  }

  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{detail}</p>
        </div>
        <div
          className={cn(
            "grid size-9 place-items-center rounded-lg",
            tones[tone],
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}

/** Chuẩn hóa trạng thái thành badge có màu sắc và nhãn đã được dịch. */
export function StatusBadge({ value }: { value: string }) {
  const { t } = useTranslation()
  const normalized = value.toUpperCase()

  // Gom các trạng thái tương đương vào cùng một nhóm màu ngữ nghĩa.
  const tone =
    normalized.includes("SUCCESS") ||
    normalized === "ACTIVE" ||
    normalized === "CONNECTED" ||
    normalized === "READ"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : normalized.includes("FAIL") ||
          normalized === "DISABLED" ||
          normalized === "REJECTED" ||
          normalized === "WRITE"
        ? "border-red-500/20 bg-red-500/10 text-red-400"
        : normalized.includes("RUNNING") || normalized === "PLANNING"
          ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
          : normalized.includes("WAIT") || normalized === "PENDING"
            ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
            : "border-border bg-muted text-muted-foreground"

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

type TableToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  placeholder: string
  children?: ReactNode
}

type FilterComboboxOption<T extends string> = {
  value: T
  label: string
}

type FilterComboboxProps<T extends string> = {
  value: T
  options: readonly FilterComboboxOption<T>[]
  onValueChange: (value: T) => void
  ariaLabel: string
  className?: string
}

/** Combobox có điều khiển dùng cho các bộ lọc trong table toolbar. */
export function FilterCombobox<T extends string>({
  value,
  options,
  onValueChange,
  ariaLabel,
  className,
}: FilterComboboxProps<T>) {
  return (
    <Combobox
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) onValueChange(nextValue)
      }}
    >
      <ComboboxTrigger
        aria-label={ariaLabel}
        className={cn(
          "flex h-9 min-w-32 items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-xs text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
      >
        <ComboboxValue>
          {(selectedValue) =>
            options.find((option) => option.value === selectedValue)?.label ??
            ariaLabel
          }
        </ComboboxValue>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          {options.map((option) => (
            <ComboboxItem
              key={option.value}
              value={option.value}
              className="text-xs"
            >
              {option.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

/** Thanh công cụ của bảng, gồm ô tìm kiếm và các bộ lọc hoặc hành động bổ sung. */
export function TableToolbar({
  query,
  onQueryChange,
  placeholder,
  children,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="h-9 bg-background pl-9 text-xs"
        />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {children}
      </div>
    </div>
  )
}

/** Trạng thái rỗng dùng chung khi bảng hoặc danh sách không có kết quả. */
export function EmptyRows({ label }: { label?: string }) {
  const { t } = useTranslation()

  return (
    <div className="px-4 py-12 text-center text-xs text-muted-foreground">
      {label ?? t("common.noResults")}
    </div>
  )
}
