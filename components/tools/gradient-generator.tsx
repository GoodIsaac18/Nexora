"use client"

import { useState } from "react"
import { Copy, RefreshCw, Download, Plus, Trash2 } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

interface GradientStop {
  color: string
  position: number
}

type GradientType = "linear" | "radial"
type LinearGradientDirection = "to right" | "to left" | "to bottom" | "to top" | "to bottom right" | "to top right" | "to bottom left" | "to top left"

export function GradientGenerator() {
  const [gradientType, setGradientType] = useState<GradientType>("linear")
  const [direction, setDirection] = useState<LinearGradientDirection>("to right")
  const [stops, setStops] = useState<GradientStop[]>([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 50 },
    { color: "#ec4899", position: 100 },
  ])

  const addStop = () => {
    const newPosition = Math.floor(Math.random() * 100)
    const newColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
    setStops([...stops, { color: newColor, position: newPosition }].sort((a, b) => a.position - b.position))
  }

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      setStops(stops.filter((_, i) => i !== index))
    }
  }

  const updateStop = (index: number, field: keyof GradientStop, value: string | number) => {
    const newStops = [...stops]
    newStops[index] = { ...newStops[index], [field]: value }
    if (field === "position") {
      newStops.sort((a, b) => a.position - b.position)
    }
    setStops(newStops)
  }

  const generateCSS = () => {
    const stopsStr = stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")
    if (gradientType === "linear") {
      return `linear-gradient(${direction}, ${stopsStr})`
    }
    return `radial-gradient(circle, ${stopsStr})`
  }

  const randomize = () => {
    const count = Math.floor(Math.random() * 3) + 2
    const newStops: GradientStop[] = []
    for (let i = 0; i < count; i++) {
      newStops.push({
        color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
        position: Math.floor((i / (count - 1)) * 100),
      })
    }
    setStops(newStops)
    setDirection(["to right", "to left", "to bottom", "to top", "to bottom right", "to top right"][Math.floor(Math.random() * 6)] as LinearGradientDirection)
  }

  const downloadCSS = () => {
    const css = `.gradient {\n  background: ${generateCSS()};\n}`
    const blob = new Blob([css], { type: "text/css" })
    const link = document.createElement("a")
    link.download = "gradient.css"
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const css = generateCSS()

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="gradient-type">Tipo de gradiente</FieldLabel>
        <select
          id="gradient-type"
          value={gradientType}
          onChange={(e) => setGradientType(e.target.value as GradientType)}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="linear">Lineal</option>
          <option value="radial">Radial</option>
        </select>

        {gradientType === "linear" && (
          <>
            <FieldLabel htmlFor="direction" className="mt-4">Dirección</FieldLabel>
            <select
              id="direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value as LinearGradientDirection)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="to right">→ Derecha</option>
              <option value="to left">← Izquierda</option>
              <option value="to bottom">↓ Abajo</option>
              <option value="to top">↑ Arriba</option>
              <option value="to bottom right">↘ Abajo derecha</option>
              <option value="to top right">↗ Arriba derecha</option>
              <option value="to bottom left">↙ Abajo izquierda</option>
              <option value="to top left">↖ Arriba izquierda</option>
            </select>
          </>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Colores del gradiente</h3>
          <div className="flex gap-2">
            <ActionButton onClick={addStop} variant="outline" disabled={stops.length >= 5}>
              <Plus className="size-4" />
            </ActionButton>
            <ActionButton onClick={randomize} variant="outline">
              <RefreshCw className="size-4" />
            </ActionButton>
          </div>
        </div>
        <div className="space-y-3">
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(index, "color", e.target.value)}
                className="h-10 w-10 rounded-lg border border-border cursor-pointer"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateStop(index, "color", e.target.value)}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono uppercase"
                maxLength={7}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => updateStop(index, "position", Number(e.target.value))}
                className="w-24"
              />
              <span className="text-xs text-muted-foreground w-8">{stop.position}%</span>
              {stops.length > 2 && (
                <button
                  onClick={() => removeStop(index)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="css-output">CSS generado</FieldLabel>
        <div className="mt-2 rounded-lg border border-border bg-muted p-4">
          <code className="text-sm font-mono break-all">{css}</code>
        </div>
        <div className="mt-3 flex gap-2">
          <CopyButton value={css} label="Copiar CSS" />
          <button
            onClick={downloadCSS}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="size-4" /> Descargar CSS
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel>Vista previa</FieldLabel>
        <div
          className="mt-2 rounded-xl h-48 w-full"
          style={{ background: css }}
        />
      </div>
    </div>
  )
}
