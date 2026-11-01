import type {
  BenchmarkAction,
  BenchmarkCheck,
  BenchmarkRootCause,
  BenchmarkRun,
  BenchmarkScenario,
  BenchmarkScenarioCreate,
} from "@/service"
import type { ReactNode } from "react"

export type BenchmarkScenarioFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: BenchmarkScenarioCreate) => Promise<void>
}

export type BenchmarkCheckFieldsProps = {
  title: string
  items: BenchmarkCheck[]
  onChange: (items: BenchmarkCheck[]) => void
}

export type BenchmarkActionFieldsProps = {
  title: string
  items: BenchmarkAction[]
  defaultAction: BenchmarkAction["action"]
  onChange: (items: BenchmarkAction[]) => void
}

export type BenchmarkGroundTruthFieldsProps = {
  items: BenchmarkRootCause[]
  onChange: (items: BenchmarkRootCause[]) => void
}

export type BenchmarkScenarioSectionProps = {
  title: string
  description: string
  children: ReactNode
}

export type BenchmarkScenarioCardProps = {
  scenario: BenchmarkScenario
  busy: boolean
  startDisabled: boolean
  onStart: (scenarioId: string) => void
  onToggle: (scenario: BenchmarkScenario) => void
}

export type BenchmarkCurrentRunProps = {
  run: BenchmarkRun
  busy: boolean
  onOpenChat: () => void
  onCleanup: () => void
}

export type BenchmarkRunHistoryProps = {
  runs: BenchmarkRun[]
  onSelect: (run: BenchmarkRun) => void
}
