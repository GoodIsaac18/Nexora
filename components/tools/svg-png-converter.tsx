"use client"

import { useState, useRef } from "react"
import { Download, ImageIcon, X } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

export function SvgPngConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [pngPreview, setPngPreview] = useState<string | null>(null)
  const [scale, setScale] = useState(2)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.toLowerCase().endsWith(".svg")) {
      alert("Por favor selecciona un archivo SVG")
      return
    }

    setFile(selectedFile)
    setPngPreview(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  async function convertToPng() {
    if (!file || !preview || !canvasRef.current) return

    setIsProcessing(true)

    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext("2d")!

      const width = img.width * scale
      const height = img.height * scale

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      const dataUrl = canvas.toDataURL("image/png")
      setPngPreview(dataUrl)
      setIsProcessing(false)
    }
    img.src = preview
  }

  function downloadPng() {
    if (!pngPreview) return

    const link = document.createElement("a")
    link.href = pngPreview
    link.download = file?.name.replace(".svg", ".png") || "converted.png"
    link.click()
  }

  function clearFile() {
    setFile(null)
    setPreview(null)
    setPngPreview(null)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="svg-file">Subir archivo SVG</FieldLabel>
        <input
          id="svg-file"
          type="file"
          accept=".svg"
          onChange={handleFileChange}
          className={inputClass()}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Convierte archivos SVG vectoriales a PNG raster con resolución personalizada.
        </p>
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">Tamaño: {(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button
              onClick={clearFile}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>

          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="SVG Preview"
                className="max-h-64 w-auto rounded-lg border border-border"
              />
            </div>
          )}

          <div className="mt-4">
            <FieldLabel htmlFor="scale">Escala: {scale}x</FieldLabel>
            <input
              id="scale"
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Mayor escala = mayor resolución y tamaño de archivo
            </p>
          </div>

          <div className="mt-4">
            <ActionButton onClick={convertToPng} disabled={isProcessing}>
              {isProcessing ? "Convirtiendo..." : "Convertir a PNG"}
            </ActionButton>
          </div>
        </Panel>
      )}

      {pngPreview && (
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">PNG convertido</p>
              <p className="text-xs text-muted-foreground">
                Resolución: {scale}x escala
              </p>
            </div>
            <ActionButton onClick={downloadPng} variant="outline">
              <Download className="size-4" />
              Descargar PNG
            </ActionButton>
          </div>

          <div className="mt-4 flex justify-center">
            <img
              src={pngPreview}
              alt="PNG Preview"
              className="max-h-64 w-auto rounded-lg border border-border"
            />
          </div>
        </Panel>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
