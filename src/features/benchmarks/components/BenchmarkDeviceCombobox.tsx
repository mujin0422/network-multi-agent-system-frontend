import { useTranslation } from "react-i18next"

import { FormCombobox } from "@/components/shared/FeatureFormSheet"
import type { ComboboxOption } from "@/types/components"

type BenchmarkDeviceComboboxProps = {
  name: string
  value: string
  options: readonly ComboboxOption[]
  onChange: (hostname: string) => void
}

/** Benchmark lưu hostname; cho phép giữ hostname cũ nếu inventory không còn thiết bị đó. */
export function BenchmarkDeviceCombobox({
  name,
  value,
  options,
  onChange,
}: BenchmarkDeviceComboboxProps) {
  const { t } = useTranslation()
  const choices = value && !options.some((item) => item.value === value)
    ? [{ value, label: value }, ...options]
    : options

  return (
    <FormCombobox
      name={name}
      value={value || null}
      onValueChange={(next) => onChange(next ?? "")}
      options={choices}
      placeholder={t("benchmarks.form.selectDevice")}
    />
  )
}
