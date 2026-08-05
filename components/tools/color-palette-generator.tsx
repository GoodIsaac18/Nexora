"use client"

import { useState, useMemo } from "react"
import { Copy, RefreshCw, Palette, Download } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

type HarmonyType = "complementary" | "analogous" | "triadic" | "tetradic" | "monochromatic"

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

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

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generatePalette(baseColor: string, harmony: HarmonyType): Color[] {
  const rgb = hexToRgb(baseColor)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const colors: Color[] = []

  colors.push({ hex: baseColor, rgb, hsl })

  switch (harmony) {
    case "complementary":
      colors.push({
        hex: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        rgb: hexToRgb(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)),
        hsl: { h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l },
      })
      break

    case "analogous":
      for (let i = -30; i <= 30; i += 30) {
        if (i === 0) continue
        const newH = (hsl.h + i + 360) % 360
        const hex = hslToHex(newH, hsl.s, hsl.l)
        colors.push({
          hex,
          rgb: hexToRgb(hex),
          hsl: { h: newH, s: hsl.s, l: hsl.l },
        })
      }
      break

    case "triadic":
      for (let i = 1; i <= 2; i++) {
        const newH = (hsl.h + i * 120) % 360
        const hex = hslToHex(newH, hsl.s, hsl.l)
        colors.push({
          hex,
          rgb: hexToRgb(hex),
          hsl: { h: newH, s: hsl.s, l: hsl.l },
        })
      }
      break

    case "tetradic":
      for (let i = 1; i <= 3; i++) {
        const newH = (hsl.h + i * 90) % 360
        const hex = hslToHex(newH, hsl.s, hsl.l)
        colors.push({
          hex,
          rgb: hexToRgb(hex),
          hsl: { h: newH, s: hsl.s, l: hsl.l },
        })
      }
      break

    case "monochromatic":
      for (let i = -20; i <= 20; i += 10) {
        if (i === 0) continue
        const newL = Math.max(0, Math.min(100, hsl.l + i))
        const hex = hslToHex(hsl.h, hsl.s, newL)
        colors.push({
          hex,
          rgb: hexToRgb(hex),
          hsl: { h: hsl.h, s: hsl.s, l: newL },
        })
      }
      break
  }

  return colors
}

export function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#3b82f6")
  const [harmony, setHarmony] = useState<HarmonyType>("complementary")
  const palette = useMemo(() => generatePalette(baseColor, harmony), [baseColor, harmony])

  const generateRandomColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
    setBaseColor(randomColor)
  }

  const downloadPalette = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 1200
    canvas.height = 400
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const colorWidth = canvas.width / palette.length
    palette.forEach((color, index) => {
      ctx.fillStyle = color.hex
      ctx.fillRect(index * colorWidth, 0, colorWidth, canvas.height)
      ctx.fillStyle = color.hsl.l > 50 ? "#000" : "#fff"
      ctx.font = "bold 24px Arial"
      ctx.fillText(color.hex.toUpperCase(), index * colorWidth + 20, canvas.height - 30)
    })

    const link = document.createElement("a")
    link.download = `palette-${baseColor.replace("#", "")}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="base-color">Color base</FieldLabel>
        <div className="flex gap-3 mt-2">
          <input
            id="base-color"
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="h-12 w-12 rounded-lg border border-border cursor-pointer"
          />
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm font-mono uppercase"
            placeholder="#000000"
            maxLength={7}
          />
          <ActionButton onClick={generateRandomColor} variant="outline">
            <RefreshCw className="size-4" />
          </ActionButton>
        </div>

        <div className="mt-4">
          <FieldLabel htmlFor="harmony">Armonía de color</FieldLabel>
          <select
            id="harmony"
            value={harmony}
            onChange={(e) => setHarmony(e.target.value as HarmonyType)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="complementary">Complementario</option>
            <option value="analogous">Análogo</option>
            <option value="triadic">Triádico</option>
            <option value="tetradic">Tetrádico</option>
            <option value="monochromatic">Monocromático</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Paleta generada</h3>
          <button
            onClick={downloadPalette}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="size-4" /> Descargar
          </button>
        </div>
        <div className="grid gap-2">
          {palette.map((color, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg p-3 transition-all hover:scale-[1.02]"
              style={{ backgroundColor: color.hex }}
            >
              <div className="flex-1">
                <p className="font-mono text-sm font-bold" style={{ color: color.hsl.l > 50 ? "#000" : "#fff" }}>
                  {color.hex.toUpperCase()}
                </p>
                <p className="text-xs" style={{ color: color.hsl.l > 50 ? "#000" : "#fff" }}>
                  RGB: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}
                </p>
                <p className="text-xs" style={{ color: color.hsl.l > 50 ? "#000" : "#fff" }}>
                  HSL: ${Math.round(color.hsl.h)}°, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%
                </p>
              </div>
              <CopyButton value={color.hex} label="Copiar" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
