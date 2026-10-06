import type { FormEvent } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Combobox, ComboboxContent, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { FORM_COMBOBOX_DEFAULT_PLACEHOLDER } from "@/constants/components"
import type { FeatureFormSheetProps, FormComboboxProps, FormFieldProps } from "@/types/components"

/**
 * Sheet dùng chung cho các form tạo mới, chỉnh sửa và xem chi tiết dữ liệu.
 * Các nút hành động ở footer được hiển thị dựa trên `mode` và quyền chỉnh sửa.
 */
export function FeatureFormSheet({ open, onOpenChange, mode, entityLabel, description, children, onSubmit, canEdit, onEdit }: FeatureFormSheetProps) {
  const { t } = useTranslation()
  const modeLabel = {
    create: t("common.add"),
    edit: t("common.edit"),
    view: t("common.view"),
  }[mode]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>
            {modeLabel} {entityLabel}
          </SheetTitle>
          <SheetDescription className="text-xs">{description}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">{children}</div>
          <SheetFooter className="border-t">
            <div className="flex w-full justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {mode === "view" ? t("common.close") : t("common.cancel")}
              </Button>
              {mode === "view" && canEdit && (
                <Button type="button" onClick={onEdit}>
                  {t("common.edit")}
                </Button>
              )}
              {mode !== "view" && <Button type="submit">{mode === "create" ? t("common.create") : t("common.saveChanges")}</Button>}
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

/** Bọc label, nội dung field và phần hướng dẫn để các form có bố cục thống nhất. */
export function FormField({ label, required, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

/** Combobox dùng chung cho các trường lựa chọn trong feature form. */
export function FormCombobox({ name, options, defaultValue, disabled, placeholder = FORM_COMBOBOX_DEFAULT_PLACEHOLDER }: FormComboboxProps) {
  return (
    <Combobox name={name} defaultValue={defaultValue ?? null} disabled={disabled}>
      <ComboboxTrigger disabled={disabled} className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60">
        <ComboboxValue placeholder={placeholder}>{(value) => options.find((option) => option.value === value)?.label ?? placeholder}</ComboboxValue>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          {options.map((option) => (
            <ComboboxItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
