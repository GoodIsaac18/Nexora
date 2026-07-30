"use client"

import { useState } from "react"
import { Droplets, Copy } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"
import { CopyButton } from "@/components/copy-button"

export function CssShadowGenerator() {
  const [mode, setMode] = useState<"shadow" | "glass">("shadow")
  const [horizontal, setHorizontal] = useState(10)
  const [vertical, setVertical] = useState(10)
  const [blur, setBlur] = useState(20)
  const [spread, setSpread] = useState(0)
  const [opacity, setOpacity] = useState(25)
  const [color, setColor] = useState("#000000")
  const [inset, setInset] = useState(false)

  const glassSettings = {
    blur: 16,
    saturation: 180,
    brightness: 95,
    opacity: 8,
  }

  function generateShadowCSS() {
    const rgbaColor = hexToRgba(color, opacity / 100)
    const shadow = inset ? "inset " : ""
    return `box-shadow: ${shadow}${horizontal}px ${vertical}px ${blur}px ${spread}px ${rgbaColor}`
  }

  function generateGlassCSS() {
    return `
background: rgba(255, 255, 255, ${glassSettings.opacity / 100});
backdrop-filter: blur(${glassSettings.blur}px);
-webkit-backdrop-filter: blur(${glassSettings.blur}px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`.trim()
  }

  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const shadowCSS = generateShadowCSS()
  const glassCSS = generateGlassCSS()

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <Panel>
        <div className="mb-4">
          <FieldLabel htmlFor="mode">Modo</FieldLabel>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("shadow")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "shadow"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Box Shadow
            </button>
            <button
              onClick={() => setMode("glass")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "glass"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Glassmorphism
            </button>
          </div>
        </div>

        {mode === "shadow" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="horizontal">Horizontal: {horizontal}px</FieldLabel>
              <input
                id="horizontal"
                type="range"
                min="-50"
                max="50"
                value={horizontal}
                onChange={(e) => setHorizontal(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <FieldLabel htmlFor="vertical">Vertical: {vertical}px</FieldLabel>
              <input
                id="vertical"
                type="range"
                min="-50"
                max="50"
                value={vertical}
                onChange={(e) => setVertical(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <FieldLabel htmlFor="blur">Blur: {blur}px</FieldLabel>
              <input
                id="blur"
                type="range"
                min="0"
                max="100"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <FieldLabel htmlFor="spread">Spread: {spread}px</FieldLabel>
              <input
                id="spread"
                type="range"
                min="-50"
                max="50"
                value={spread}
                onChange={(e) => setSpread(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <FieldLabel htmlFor="opacity">Opacity: {opacity}%</FieldLabel>
              <input
                id="opacity"
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <FieldLabel htmlFor="color">Color</FieldLabel>
              <input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-full rounded-lg border border-border"
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                id="inset"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="inset" className="text-sm">Inset shadow</label>
            </div>
          </div>
        )}
      </Panel>

      <Panel>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium">Vista previa</h3>
          <CopyButton value={mode === "shadow" ? shadowCSS : glassCSS} />
        </div>

        <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-muted p-8">
          <div
            className="w-64 rounded-xl bg-background p-6 text-center"
            style={
              mode === "shadow"
                ? { boxShadow: shadowCSS.replace("box-shadow: ", "") }
                : {
                    background: `rgba(255, 255, 255, ${glassSettings.opacity / 100})`,
                    backdropFilter: `blur(${glassSettings.blur}px)`,
                    WebkitBackdropFilter: `blur(${glassSettings.blur}px)`,
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  }
            }
          >
            <p className="text-sm font-medium">Ejemplo de elemento</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {mode === "shadow" ? "Con sombra personalizada" : "Efecto glassmorphism"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FieldLabel htmlFor="css-output">CSS generado</FieldLabel>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
            <code>{mode === "shadow" ? shadowCSS : glassCSS}</code>
          </pre>
        </div>
      </Panel>
    </div>
  )
}
