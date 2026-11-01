import { FormField } from "@/components/shared/FeatureFormSheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BenchmarkRootCause } from "@/service"
import { useTranslation } from "react-i18next"
import type { BenchmarkGroundTruthFieldsProps } from "../types/benchmark.type"
import { createEmptyRootCause } from "../utils/benchmark-scenario-form.util"

export function BenchmarkGroundTruthFields({ items, onChange }: BenchmarkGroundTruthFieldsProps) {
  const { t } = useTranslation()

  function update(index: number, next: BenchmarkRootCause) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? next : item))
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-lg border bg-background p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium">{t("benchmarks.form.labels.rootCause")} {index + 1}</p>
            {items.length > 1 && (
              <Button type="button" size="xs" variant="ghost" className="text-destructive" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>{t("benchmarks.form.buttons.remove")}</Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label={t("benchmarks.form.fields.faultType")} required>
              <Input value={item.fault_type} required placeholder="link_down" onChange={(event) => update(index, { ...item, fault_type: event.target.value })} />
            </FormField>
            <FormField label={t("benchmarks.form.fields.device")} required>
              <Input value={item.device} required placeholder="P3" onChange={(event) => update(index, { ...item, device: event.target.value })} />
            </FormField>
            <FormField label={t("benchmarks.form.fields.interface")}>
              <Input value={item.interface ?? ""} placeholder="FastEthernet0/0" onChange={(event) => update(index, { ...item, interface: event.target.value || null })} />
            </FormField>
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, createEmptyRootCause()])}>{t("benchmarks.form.buttons.addRootCause")}</Button>
    </div>
  )
}
