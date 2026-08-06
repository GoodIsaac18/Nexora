"use client"

import { useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { Panel } from "@/components/tools/ui"

function hexToRgb(hex: string) {
  const m = hex.replace("#", "")
  const n = parseInt(m, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHsl(r: number, g: number, b: number) {
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
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function ColorPicker() {
  const [hex, setHex] = useState("#4f46e5")
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)

  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
  ]

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div
          className="flex h-36 sm:h-48 items-end rounded-xl border border-border p-3 sm:p-4 transition-colors duration-300"
          style={{ backgroundColor: hex }}
        >
          <span
            className="rounded-lg px-2 sm:px-2.5 py-1 font-mono text-xs sm:text-sm backdrop-blur"
            style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "#111" }}
          >
            {hex.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            aria-label="Pick a color"
            className="h-10 sm:h-12 w-12 sm:w-16 cursor-pointer rounded-lg border border-border bg-transparent"
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="h-10 sm:h-12 flex-1 rounded-xl border border-border bg-background px-3 font-mono text-xs sm:text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        {formats.map((f) => (
          <div
            key={f.label}
            className="flex items-center justify-between gap-2 sm:gap-3 rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3"
          >
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-muted-foreground">{f.label}</p>
              <code className="font-mono text-xs sm:text-sm">{f.value}</code>
            </div>
            <CopyButton value={f.value} label="" className="shrink-0 px-2" />
          </div>
        ))}
        <div className="mt-1 grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-xl border border-border bg-background p-3 sm:p-4 text-center" style={{ color: hex }}>
            <span className="text-base sm:text-lg font-semibold">Aa</span>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">On light</p>
          </div>
          <div
            className="rounded-xl border border-border p-3 sm:p-4 text-center"
            style={{ backgroundColor: "#111", color: hex }}
          >
            <span className="text-base sm:text-lg font-semibold">Aa</span>
            <p className="mt-1 text-[10px] sm:text-xs" style={{ color: "#888" }}>
              On dark
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
