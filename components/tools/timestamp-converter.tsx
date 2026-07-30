"use client"

import { useEffect, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

function formatLocal(ms: number) {
  if (Number.isNaN(ms)) return "—"
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date(ms))
}

export function TimestampConverter() {
  const [now, setNow] = useState(() => Date.now())
  const [unixInput, setUnixInput] = useState("")
  const [dateInput, setDateInput] = useState("")

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const unixSeconds = Math.floor(now / 1000)
  const unixMs = now

  let fromUnix = ""
  let parsedUnix: number | null = null
  const trimmed = unixInput.trim()
  if (trimmed) {
    const n = Number(trimmed)
    if (!Number.isNaN(n)) {
      parsedUnix = trimmed.length > 10 ? n : n * 1000
      fromUnix = formatLocal(parsedUnix)
    } else {
      fromUnix = "Invalid timestamp"
    }
  }

  let toUnix = ""
  if (dateInput) {
    const d = new Date(dateInput)
    if (Number.isNaN(d.getTime())) toUnix = "Invalid date"
    else {
      toUnix = `${Math.floor(d.getTime() / 1000)} (seconds)\n${d.getTime()} (milliseconds)`
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <p className="text-sm text-muted-foreground">Current time</p>
        <p className="mt-1 font-mono text-lg">{formatLocal(now)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton value={String(unixSeconds)} label="Copy seconds" />
          <CopyButton value={String(unixMs)} label="Copy ms" />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <FieldLabel htmlFor="unix-in">Unix timestamp → date</FieldLabel>
          <input
            id="unix-in"
            value={unixInput}
            onChange={(e) => setUnixInput(e.target.value)}
            placeholder="1700000000 or milliseconds"
            className={inputClass()}
          />
          {unixInput && (
            <p className="mt-3 text-sm">
              <span className="text-muted-foreground">Local: </span>
              {fromUnix}
            </p>
          )}
        </Panel>
        <Panel>
          <FieldLabel htmlFor="date-in">Date & time → Unix</FieldLabel>
          <input
            id="date-in"
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className={inputClass()}
          />
          {dateInput && (
            <pre className="mt-3 whitespace-pre-wrap font-mono text-sm">{toUnix}</pre>
          )}
        </Panel>
      </div>

      <div className="flex justify-center">
        <ActionButton
          variant="outline"
          onClick={() => {
            setUnixInput(String(unixSeconds))
            setDateInput(new Date(now).toISOString().slice(0, 16))
          }}
        >
          Use current time
        </ActionButton>
      </div>
    </div>
  )
}
