"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel } from "@/components/tools/ui"

export function QrCodeGenerator() {
  const [text, setText] = useState("https://nexora-jade-eta.vercel.app")
  const [size, setSize] = useState(256)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !text.trim()) return
    setError("")
    QRCode.toCanvas(canvas, text, { width: size, margin: 2 }, (err) => {
      if (err) setError("Could not generate QR code for this content.")
    })
  }, [text, size])

  function downloadPng() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement("a")
    a.download = "qrcode.png"
    a.href = canvas.toDataURL("image/png")
    a.click()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="qr-text">URL or text</FieldLabel>
        <textarea
          id="qr-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[100px] sm:min-h-[120px]"
          placeholder="https://… or any text"
        />
        <div className="mt-4">
          <FieldLabel htmlFor="qr-size">Size ({size}px)</FieldLabel>
          <input
            id="qr-size"
            type="range"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton value={text} label="Copy text" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 flex flex-col items-center justify-center gap-4">
        <div className="w-full flex items-center justify-center bg-white rounded-xl border border-border p-2 sm:p-4 overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="max-w-full h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="button"
          onClick={downloadPng}
          disabled={!text.trim()}
          className="inline-flex h-10 items-center rounded-xl border border-border bg-background px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Download PNG
        </button>
      </div>
    </div>
  )
}
