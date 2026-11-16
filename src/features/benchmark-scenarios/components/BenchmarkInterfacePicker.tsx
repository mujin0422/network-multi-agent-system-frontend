import { useTranslation } from "react-i18next"

import { FormCombobox } from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"

import {
  BENCHMARK_INTERFACE_TYPES,
  benchmarkInterfacePartCount,
  formatBenchmarkInterface,
  isValidBenchmarkInterface,
  parseBenchmarkInterface,
} from "../utils/benchmark-interface.util"

type BenchmarkInterfacePickerProps = {
  name: string
  value: string | null | undefined
  onChange: (value: string | null) => void
}

const INTERFACE_OPTIONS = BENCHMARK_INTERFACE_TYPES.map((type) => ({
  label: type,
  value: type,
}))

/**
 * Produces the existing backend string format, such as:
 * Ethernet0/0, GigabitEthernet0/0/0, or Loopback0.
 * Each interface type has a fixed number of numeric inputs.
 */
export function BenchmarkInterfacePicker({
  name,
  value,
  onChange,
}: BenchmarkInterfacePickerProps) {
  const { t } = useTranslation()
  const selection = parseBenchmarkInterface(value)
  const unsupported = Boolean(value) && !selection
  const partCount = selection ? benchmarkInterfacePartCount(selection.type) : 0

  function setType(next: string | null) {
    const type = BENCHMARK_INTERFACE_TYPES.find((option) => option === next)
    if (!type) {
      onChange(null)
      return
    }

    const parts = Array.from(
      { length: benchmarkInterfacePartCount(type) },
      (_, index) => selection?.parts[index] ?? "0",
    )
    onChange(formatBenchmarkInterface(type, parts))
  }

  function setNumber(index: number, next: string) {
    if (!selection || !/^\d*$/.test(next)) return

    // Normalize an older interface layout only when the user edits a number.
    const parts = Array.from(
      { length: partCount },
      (_, partIndex) => selection.parts[partIndex] ?? "",
    )
    parts[index] = next
    onChange(formatBenchmarkInterface(selection.type, parts))
  }

  return (
    <div className="min-w-0 space-y-2">
      <FormCombobox
        name={`${name}-type`}
        value={selection?.type ?? null}
        options={INTERFACE_OPTIONS}
        placeholder={t("benchmarks.form.interfacePicker.selectType")}
        onValueChange={setType}
      />
      {selection && (
        <div className="flex min-w-0 items-center gap-1.5">
          {Array.from({ length: partCount }, (_, index) => (
            <div key={index} className="contents">
              {index > 0 && (
                <span aria-hidden="true" className="shrink-0 text-muted-foreground">/</span>
              )}
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                placeholder="0"
                aria-label={t("benchmarks.form.interfacePicker.numberLabel", {
                  index: index + 1,
                })}
                className="min-w-0 flex-1 font-mono"
                value={selection.parts[index] ?? ""}
                onChange={(event) => setNumber(index, event.target.value)}
              />
            </div>
          ))}
        </div>
      )}
      {unsupported ? (
        <p role="alert" className="type-caption text-destructive">
          {t("benchmarks.form.interfacePicker.unsupported", { value })}
        </p>
      ) : value && !isValidBenchmarkInterface(value) ? (
        <p role="alert" className="type-caption text-destructive">
          {t("benchmarks.form.interfacePicker.completeNumbers")}
        </p>
      ) : (
        <p className="type-caption text-muted-foreground">
          {t("benchmarks.form.interfacePicker.numberingHint")}
        </p>
      )}
    </div>
  )
}
