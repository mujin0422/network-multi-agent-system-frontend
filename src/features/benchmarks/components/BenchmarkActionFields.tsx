import { FormField } from "@/components/shared/FeatureFormSheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BenchmarkAction } from "@/service"
import { useTranslation } from "react-i18next"
import { BENCHMARK_ACTION_OPTIONS } from "../constants/benchmarks.constants"
import type { BenchmarkActionFieldsProps } from "../types/benchmark.type"
import { createEmptyAction } from "../utils/benchmark-scenario-form.util"

export function BenchmarkActionFields({ title, items, defaultAction, onChange }: BenchmarkActionFieldsProps) {
  const { t } = useTranslation()

  function update(index: number, next: BenchmarkAction) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? next : item))
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-lg border bg-background p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium">{title} {index + 1}</p>
            {items.length > 1 && (
              <Button type="button" size="xs" variant="ghost" className="text-destructive" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>{t("benchmarks.form.buttons.remove")}</Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label={t("benchmarks.form.fields.device")} required>
              <Input value={item.device} required placeholder="P3" onChange={(event) => update(index, { ...item, device: event.target.value })} />
            </FormField>
            <FormField label={t("benchmarks.form.fields.interface")} required>
              <Input value={item.interface} required placeholder="FastEthernet0/0" onChange={(event) => update(index, { ...item, interface: event.target.value })} />
            </FormField>
            <FormField label={t("benchmarks.form.fields.action")} required>
              <select
                value={item.action}
                className="h-control-md w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                onChange={(event) => update(index, { ...item, action: event.target.value as BenchmarkAction["action"] })}
              >
                {BENCHMARK_ACTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
              </select>
            </FormField>
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, createEmptyAction(defaultAction)])}>{t("benchmarks.form.buttons.addAction")}</Button>
    </div>
  )
}
