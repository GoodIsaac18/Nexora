"use client"

import { useState } from "react"
import { Check, X, AlertCircle, Copy, RefreshCw } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

interface WCAGLevel {
  level: string
  aa: { normal: boolean; large: boolean }
  aaa: { normal: boolean; large: boolean }
}

function checkWCAG(ratio: number): WCAGLevel {
  return {
    level: ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "A" : "Fail",
    aa: {
      normal: ratio >= 4.5,
      large: ratio >= 3,
    },
    aaa: {
      normal: ratio >= 7,
      large: ratio >= 4.5,
    },
  }
}

export function ColorContrastChecker() {
  const [foregroundColor, setForegroundColor] = useState("#ffffff")
  const [backgroundColor, setBackgroundColor] = useState("#000000")
  const [fontSize, setFontSize] = useState(16)

  const contrastRatio = getContrastRatio(foregroundColor, backgroundColor)
  const wcag = checkWCAG(contrastRatio)

  const randomize = () => {
    setForegroundColor("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"))
    setBackgroundColor("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"))
  }

  const swapColors = () => {
    const temp = foregroundColor
    setForegroundColor(backgroundColor)
    setBackgroundColor(temp)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <FieldLabel htmlFor="foreground-color">Color de texto (foreground)</FieldLabel>
          <div className="flex gap-3 mt-2">
            <input
              id="foreground-color"
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="h-12 w-12 rounded-lg border border-border cursor-pointer"
            />
            <input
              type="text"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm font-mono uppercase"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <FieldLabel htmlFor="background-color">Color de fondo (background)</FieldLabel>
          <div className="flex gap-3 mt-2">
            <input
              id="background-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-12 w-12 rounded-lg border border-border cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm font-mono uppercase"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <ActionButton onClick={randomize} variant="outline">
          <RefreshCw className="size-4" /> Aleatorio
        </ActionButton>
        <ActionButton onClick={swapColors} variant="outline">
          Intercambiar
        </ActionButton>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="font-size">Tamaño de fuente (px)</FieldLabel>
        <input
          id="font-size"
          type="range"
          min="12"
          max="48"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="mt-2 w-full"
        />
        <p className="mt-1 text-sm text-muted-foreground">{fontSize}px</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <span className="text-sm font-medium">Vista previa</span>
        <div
          className="mt-2 rounded-xl p-6"
          style={{ backgroundColor, color: foregroundColor }}
        >
          <p style={{ fontSize: `${fontSize}px` }}>
            Este es un ejemplo de texto con los colores seleccionados. El contraste es de{" "}
            {contrastRatio.toFixed(2)}:1
          </p>
          <p className="mt-2" style={{ fontSize: `${fontSize * 1.5}px`, fontWeight: "bold" }}>
            Texto grande en negrita
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <span className="text-sm font-medium">Ratio de contraste</span>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-3xl font-bold">{contrastRatio.toFixed(2)}:1</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              wcag.level === "AAA"
                ? "bg-green-500/20 text-green-700"
                : wcag.level === "AA"
                ? "bg-blue-500/20 text-blue-700"
                : wcag.level === "A"
                ? "bg-yellow-500/20 text-yellow-700"
                : "bg-red-500/20 text-red-700"
            }`}
          >
            {wcag.level}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <span className="text-sm font-medium">Cumplimiento WCAG</span>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <p className="font-medium">AA Normal (4.5:1)</p>
              <p className="text-xs text-muted-foreground">Texto normal</p>
            </div>
            {wcag.aa.normal ? (
              <Check className="size-5 text-green-600" />
            ) : (
              <X className="size-5 text-red-600" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <p className="font-medium">AA Grande (3:1)</p>
              <p className="text-xs text-muted-foreground">Texto 18px+ o 14px+ negrita</p>
            </div>
            {wcag.aa.large ? (
              <Check className="size-5 text-green-600" />
            ) : (
              <X className="size-5 text-red-600" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <p className="font-medium">AAA Normal (7:1)</p>
              <p className="text-xs text-muted-foreground">Texto normal</p>
            </div>
            {wcag.aaa.normal ? (
              <Check className="size-5 text-green-600" />
            ) : (
              <X className="size-5 text-red-600" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <p className="font-medium">AAA Grande (4.5:1)</p>
              <p className="text-xs text-muted-foreground">Texto 18px+ o 14px+ negrita</p>
            </div>
            {wcag.aaa.large ? (
              <Check className="size-5 text-green-600" />
            ) : (
              <X className="size-5 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {!wcag.aa.normal && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive">No cumple WCAG AA</p>
            <p className="text-sm text-destructive">
              Este par de colores no cumple con los estándares de accesibilidad WCAG para texto normal. Considera ajustar los colores.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
