import { useTranslation } from "react-i18next"

import { FormCombobox } from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"

import {
  BENCHMARK_INTERFACE_TYPES,
  defaultInterfacePartCount,
  formatBenchmarkInterface,
  isValidBenchmarkInterface,
  parseBenchmarkInterface,
  type BenchmarkInterfaceType,
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
 * Builds the existing backend interface string (e.g. GigabitEthernet0/1).
 * The type and numbering layout are dropdowns; only the numeric slots are editable.
 */
export function BenchmarkInterfacePicker({
  name,
  value,
  onChange,
}: BenchmarkInterfacePickerProps) {
  const { t } = useTranslation()
  const selection = parseBenchmarkInterface(value)
  const unsupported = Boolean(value) && !selection
  const partCount = selection?.parts.length ?? 2

  function setType(next: string | null) {
    if (!next || !BENCHMARK_INTERFACE_TYPES.some((type) => type === next)) {
      onChange(null)
      return
    }
    const type = next as BenchmarkInterfaceType
    const parts = selection?.parts ?? Array(defaultInterfacePartCount(type)).fill("0")
    onChange(formatBenchmarkInterface(type, parts))
  }

  function setPartCount(next: string | null) {
    if (!selection || (next !== "2" && next !== "3")) return
    const length = Number(next)
    const parts = Array.from(
      { length },
      (_, index) => selection.parts[index] ?? "0",
    )
    onChange(formatBenchmarkInterface(selection.type, parts))
  }

  function setNumber(index: number, next: string) {
    if (!selection || !/^\d*$/.test(next)) return
    const parts = [...selection.parts]
    parts[index] = next
    onChange(formatBenchmarkInterface(selection.type, parts))
  }

  return (
    <div className="min-w-0 space-y-2">
      <div className="grid grid-cols-[minmax(0,1fr)_104px] gap-2">
        <FormCombobox
          name={`${name}-type`}
          value={selection?.type ?? null}
          options={INTERFACE_OPTIONS}
          placeholder={t("benchmarks.form.interfacePicker.selectType")}
          onValueChange={setType}
        />
        <FormCombobox
          name={`${name}-layout`}
          value={selection ? String(partCount) : null}
          disabled={!selection}
          options={[
            { value: "2", label: "0/0" },
            { value: "3", label: "0/0/0" },
          ]}
          placeholder="0/0"
          onValueChange={setPartCount}
        />
      </div>
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
              disabled={!selection}
              className="min-w-0 flex-1 font-mono"
              value={selection?.parts[index] ?? ""}
              onChange={(event) => setNumber(index, event.target.value)}
            />
          </div>
        ))}
      </div>
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
