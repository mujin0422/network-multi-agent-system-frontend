import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export type FormMode = "create" | "edit" | "view"

export type FeatureFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: FormMode
  entityLabel: string
  description: string
  children: ReactNode
  onSubmit?: () => void
  canEdit?: boolean
  onEdit?: () => void
}

export type FormFieldProps = {
  label: string
  required?: boolean
  children: ReactNode
  hint?: string
}

export type ComboboxOption<T extends string = string> = {
  value: T
  label: string
}

export type FormComboboxProps = {
  name: string
  options: readonly ComboboxOption[]
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
}

export type FeatureHeaderProps = {
  title: string
  description: string
  action?: ReactNode
  secondaryAction?: ReactNode
}

export type StatCardTone = "blue" | "green" | "amber" | "red" | "violet"

export type StatCardProps = {
  label: string
  value: string | number
  detail: string
  icon: LucideIcon
  tone?: StatCardTone
}

export type StatusBadgeProps = {
  value: string
}

export type TableToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  placeholder: string
  children?: ReactNode
}

export type FilterComboboxProps<T extends string> = {
  value: T
  options: readonly ComboboxOption<T>[]
  onValueChange: (value: T) => void
  ariaLabel: string
  className?: string
}

export type EmptyRowsProps = {
  label?: string
}

export type DataPaginationProps = {
  page: number
  pageCount: number
  pageSize: number
  totalRows: number
  onPageChange: (page: number) => void
}

export type MoreMenuProps = {
  onView?: () => void
  onEdit?: () => void
  onCopy?: () => void
}

export type LanguageSwitcherProps = {
  compact?: boolean
}
