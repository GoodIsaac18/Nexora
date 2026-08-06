"use client"

import { useState } from "react"
import { Copy, RefreshCw, Download } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

interface BoxShadow {
  hOffset: number
  vOffset: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

export function BoxShadowGenerator() {
  const [shadow, setShadow] = useState<BoxShadow>({
    hOffset: 0,
    vOffset: 4,
    blur: 6,
    spread: -1,
    color: "rgba(0, 0, 0, 0.1)",
    inset: false,
  })

  const generateCSS = () => {
    const { hOffset, vOffset, blur, spread, color, inset } = shadow
    const insetStr = inset ? "inset " : ""
    return `${insetStr}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${color}`
  }

  const randomize = () => {
    setShadow({
      hOffset: Math.floor(Math.random() * 20) - 10,
      vOffset: Math.floor(Math.random() * 20) - 10,
      blur: Math.floor(Math.random() * 30),
      spread: Math.floor(Math.random() * 20) - 10,
      color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${(Math.random() * 0.5 + 0.1).toFixed(2)})`,
      inset: Math.random() > 0.8,
    })
  }

  const downloadCSS = () => {
    const css = `.box-shadow {\n  box-shadow: ${generateCSS()};\n}`
    const blob = new Blob([css], { type: "text/css" })
    const link = document.createElement("a")
    link.download = "box-shadow.css"
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const css = generateCSS()

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[350px_1fr]">
      {/* Vista previa - visible en móvil arriba, a la derecha en PC */}
      <div className="order-1 lg:order-2">
        <h3 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Vista previa</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div
            className="rounded-xl h-24 sm:h-40 flex items-center justify-center bg-background border border-border"
            style={{ boxShadow: css }}
          >
            <span className="text-[10px] sm:text-sm text-muted-foreground">Fondo claro</span>
          </div>
          <div
            className="rounded-xl h-24 sm:h-40 flex items-center justify-center bg-primary text-primary-foreground"
            style={{ boxShadow: css }}
          >
            <span className="text-[10px] sm:text-sm">Fondo primario</span>
          </div>
          <div
            className="rounded-xl h-24 sm:h-40 flex items-center justify-center bg-muted"
            style={{ boxShadow: css }}
          >
            <span className="text-[10px] sm:text-sm text-muted-foreground">Fondo muted</span>
          </div>
          <div
            className="rounded-xl h-24 sm:h-40 flex items-center justify-center bg-black text-white"
            style={{ boxShadow: css }}
          >
            <span className="text-[10px] sm:text-sm">Fondo oscuro</span>
          </div>
        </div>
        
        <div
          className="rounded-xl p-4 sm:p-8 bg-background border border-border"
          style={{ boxShadow: css }}
        >
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-1 sm:mb-2">Ejemplo de tarjeta</p>
          <p className="text-xs sm:text-base">Este es un ejemplo de cómo se ve la sombra en un elemento más grande con contenido de texto.</p>
        </div>
      </div>

      {/* Panel de controles - sticky en PC */}
      <div className="order-2 lg:order-1 space-y-3 sm:space-y-4 lg:sticky lg:top-4 lg:h-fit">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Controles</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <FieldLabel htmlFor="h-offset">Desplazamiento X</FieldLabel>
              <input
                id="h-offset"
                type="range"
                min="-50"
                max="50"
                value={shadow.hOffset}
                onChange={(e) => setShadow({ ...shadow, hOffset: Number(e.target.value) })}
                className="mt-2 w-full"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{shadow.hOffset}px</p>
            </div>

            <div>
              <FieldLabel htmlFor="v-offset">Desplazamiento Y</FieldLabel>
              <input
                id="v-offset"
                type="range"
                min="-50"
                max="50"
                value={shadow.vOffset}
                onChange={(e) => setShadow({ ...shadow, vOffset: Number(e.target.value) })}
                className="mt-2 w-full"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{shadow.vOffset}px</p>
            </div>

            <div>
              <FieldLabel htmlFor="blur">Desenfoque</FieldLabel>
              <input
                id="blur"
                type="range"
                min="0"
                max="100"
                value={shadow.blur}
                onChange={(e) => setShadow({ ...shadow, blur: Number(e.target.value) })}
                className="mt-2 w-full"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{shadow.blur}px</p>
            </div>

            <div>
              <FieldLabel htmlFor="spread">Expansión</FieldLabel>
              <input
                id="spread"
                type="range"
                min="-50"
                max="50"
                value={shadow.spread}
                onChange={(e) => setShadow({ ...shadow, spread: Number(e.target.value) })}
                className="mt-2 w-full"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{shadow.spread}px</p>
            </div>

            <div>
              <FieldLabel htmlFor="color">Color</FieldLabel>
              <div className="flex gap-2 mt-2">
                <input
                  id="color"
                  type="color"
                  value={shadow.color.startsWith("rgba") ? "#000000" : shadow.color}
                  onChange={(e) => {
                    const hex = e.target.value
                    const r = parseInt(hex.slice(1, 3), 16)
                    const g = parseInt(hex.slice(3, 5), 16)
                    const b = parseInt(hex.slice(5, 7), 16)
                    const currentOpacity = shadow.color.match(/[\d.]+\)$/)?.[0] || "0.1)"
                    setShadow({ ...shadow, color: `rgba(${r}, ${g}, ${b}, ${currentOpacity}` })
                  }}
                  className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg border border-border cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={shadow.color}
                  onChange={(e) => setShadow({ ...shadow, color: e.target.value })}
                  className="flex-1 rounded-lg border border-border bg-background px-2 sm:px-3 py-2 text-[10px] sm:text-xs font-mono"
                  placeholder="rgba(0, 0, 0, 0.1)"
                />
              </div>
              <div className="mt-2">
                <FieldLabel htmlFor="opacity">Opacidad</FieldLabel>
                <input
                  id="opacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={shadow.color.match(/[\d.]+\)$/)?.[0]?.replace(")", "") || "0.1"}
                  onChange={(e) => {
                    const opacity = e.target.value
                    const currentRgb = shadow.color.match(/rgba?\(([\d, ]+)\)/)?.[1] || "0, 0, 0"
                    setShadow({ ...shadow, color: `rgba(${currentRgb}, ${opacity})` })
                  }}
                  className="mt-2 w-full"
                />
                <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{shadow.color.match(/[\d.]+\)$/)?.[0]?.replace(")", "") || "0.1"}</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shadow.inset}
                onChange={(e) => setShadow({ ...shadow, inset: e.target.checked })}
                className="w-3 sm:w-4 h-3 sm:h-4 rounded border-border"
              />
              <span className="text-[10px] sm:text-xs font-medium">Inset (sombra interna)</span>
            </label>

            <ActionButton onClick={randomize} variant="outline" className="w-full h-9 sm:h-auto">
              <RefreshCw className="size-3 sm:size-4" /> Aleatorio
            </ActionButton>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <FieldLabel htmlFor="css-output">CSS generado</FieldLabel>
          <div className="mt-2 rounded-lg border border-border bg-muted p-2 sm:p-3">
            <code className="text-[10px] sm:text-xs font-mono break-all">box-shadow: {css};</code>
          </div>
          <div className="mt-2 sm:mt-3 flex gap-2">
            <CopyButton value={`box-shadow: ${css};`} label="Copiar" />
            <button
              onClick={downloadCSS}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium transition-colors hover:bg-muted"
            >
              <Download className="size-3 sm:size-4" /> Descargar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
