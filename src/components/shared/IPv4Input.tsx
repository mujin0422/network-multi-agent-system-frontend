import { useRef, type ClipboardEvent, type KeyboardEvent } from "react"

import { Input } from "@/components/ui/input"
import { isValidIPv4, ipv4Octets } from "@/lib/ipv4"
import { cn } from "@/lib/utils"

export type IPv4InputProps = {
  value?: string | null
  onChange: (value: string) => void
  label: string
  disabled?: boolean
  className?: string
}

/**
 * Reusable four-octet IPv4 editor.
 * Accepts whole-address paste, dot/arrow navigation, and keyboard Tab.
 * Produces a normal dotted string for the API, including incomplete edits.
 */
export function IPv4Input({
  value,
  onChange,
  label,
  disabled,
  className,
}: IPv4InputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const octets = ipv4Octets(value)

  function updateOctet(index: number, next: string) {
    if (!/^\d{0,3}$/.test(next) || (next !== "" && Number(next) > 255)) return

    const updated = [...octets]
    updated[index] = next
    onChange(updated.every((octet) => octet === "") ? "" : updated.join("."))

    if (next.length === 3 && index < 3) {
      refs.current[index + 1]?.focus()
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").trim()
    if (!pasted.includes(".")) return

    event.preventDefault()
    if (!isValidIPv4(pasted)) return

    // Normalize leading zeroes on full-address paste.
    onChange(pasted.split(".").map((part) => String(Number(part))).join("."))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === "." && index < 3) {
      event.preventDefault()
      refs.current[index + 1]?.focus()
      return
    }

    if (event.key === "Backspace" && octets[index] === "" && index > 0) {
      event.preventDefault()
      refs.current[index - 1]?.focus()
      return
    }

    const input = event.currentTarget
    if (event.key === "ArrowLeft" && input.selectionStart === 0 && index > 0) {
      event.preventDefault()
      refs.current[index - 1]?.focus()
    } else if (
      event.key === "ArrowRight" &&
      input.selectionStart === input.value.length &&
      index < 3
    ) {
      event.preventDefault()
      refs.current[index + 1]?.focus()
    }
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex min-w-0 items-center gap-1.5", className)}
    >
      {octets.map((octet, index) => (
        <div key={index} className="contents">
          {index > 0 && (
            <span aria-hidden="true" className="shrink-0 text-muted-foreground">
              .
            </span>
          )}
          <Input
            ref={(element) => { refs.current[index] = element }}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={3}
            pattern="[0-9]*"
            value={octet}
            disabled={disabled}
            placeholder="0"
            aria-label={`${label} - octet ${index + 1} of 4`}
            className="min-w-0 flex-1 px-1 text-center font-mono"
            onChange={(event) => updateOctet(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
          />
        </div>
      ))}
    </div>
  )
}
