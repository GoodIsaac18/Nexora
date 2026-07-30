"use client"

import { useMemo, useState } from "react"
import { FieldLabel, Panel, inputClass } from "@/components/tools/ui"

type UnitGroup = {
  id: string
  label: string
  base: string
  units: Record<string, number>
}

const GROUPS: UnitGroup[] = [
  {
    id: "length",
    label: "Length",
    base: "m",
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 },
  },
  {
    id: "weight",
    label: "Weight",
    base: "kg",
    units: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125 },
  },
  {
    id: "temp",
    label: "Temperature",
    base: "c",
    units: { c: 1, f: 1, k: 1 },
  },
  {
    id: "volume",
    label: "Volume",
    base: "l",
    units: { l: 1, ml: 0.001, gal: 3.785411784, floz: 0.0295735295625 },
  },
]

function convertTemp(value: number, from: string, to: string): number {
  let c = value
  if (from === "f") c = ((value - 32) * 5) / 9
  else if (from === "k") c = value - 273.15
  if (to === "f") return (c * 9) / 5 + 32
  if (to === "k") return c + 273.15
  return c
}

export function UnitConverter() {
  const [groupId, setGroupId] = useState("length")
  const [amount, setAmount] = useState("1")
  const [fromUnit, setFromUnit] = useState("m")
  const [toUnit, setToUnit] = useState("ft")

  const group = GROUPS.find((g) => g.id === groupId)!
  const unitKeys = Object.keys(group.units)

  const result = useMemo(() => {
    const n = Number(amount)
    if (Number.isNaN(n) || amount.trim() === "") return ""
    if (groupId === "temp") {
      const v = convertTemp(n, fromUnit, toUnit)
      return String(Math.round(v * 1e6) / 1e6)
    }
    const base = n * group.units[fromUnit]
    const out = base / group.units[toUnit]
    return String(Math.round(out * 1e8) / 1e8)
  }, [amount, fromUnit, toUnit, group, groupId])

  function onGroupChange(id: string) {
    setGroupId(id)
    const g = GROUPS.find((x) => x.id === id)!
    const keys = Object.keys(g.units)
    setFromUnit(keys[0])
    setToUnit(keys[1] ?? keys[0])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => onGroupChange(g.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              groupId === g.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <Panel className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <FieldLabel htmlFor="amount">Amount</FieldLabel>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass()}
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className={`${inputClass("mt-2")} cursor-pointer`}
          >
            {unitKeys.map((u) => (
              <option key={u} value={u}>
                {u.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <p className="hidden pb-3 text-center text-muted-foreground sm:block">→</p>
        <div>
          <FieldLabel>Result</FieldLabel>
          <output className="flex h-10 items-center rounded-xl border border-border bg-muted/40 px-3 font-mono text-sm">
            {result || "—"}
          </output>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className={`${inputClass("mt-2")} cursor-pointer`}
          >
            {unitKeys.map((u) => (
              <option key={u} value={u}>
                {u.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </Panel>
    </div>
  )
}
