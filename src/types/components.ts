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
  value?: string | null
  onValueChange?: (value: string | null) => void
  disabled?: boolean
  placeholder?: string
}

export type StatusBadgeProps = {
  value: string
}

export type MoreMenuProps = {
  onView?: () => void
  onEdit?: () => void
  onCopy?: () => void
}

export type LanguageSwitcherProps = {
  compact?: boolean
}
