"use client"

import { useState, useRef } from "react"
import { Download, Sparkles, X, Image as ImageIcon } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null)
  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState<"webp" | "jpeg" | "png">("webp")
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    setFile(selectedFile)
    setOriginalSize(selectedFile.size)
    setCompressedPreview(null)
    setCompressedSize(0)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  async function compressImage() {
    if (!file || !preview || !canvasRef.current) return

    setIsProcessing(true)

    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext("2d")!

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const mimeType = format === "webp" ? "image/webp" : format === "jpeg" ? "image/jpeg" : "image/png"
      const dataUrl = canvas.toDataURL(mimeType, quality / 100)

      setCompressedPreview(dataUrl)

      // Calculate compressed size
      const base64Length = dataUrl.length - (dataUrl.indexOf(",") + 1)
      const padding = (dataUrl.length - base64Length) * 0.75
      const sizeInBytes = (base64Length * 0.75) + padding
      setCompressedSize(sizeInBytes)

      setIsProcessing(false)
    }
    img.src = preview
  }

  function downloadCompressed() {
    if (!compressedPreview) return

    const link = document.createElement("a")
    link.href = compressedPreview
    const extension = format === "webp" ? "webp" : format === "jpeg" ? "jpg" : "png"
    link.download = `compressed.${extension}`
    link.click()
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  function calculateReduction() {
    if (originalSize === 0 || compressedSize === 0) return 0
    return Math.round(((originalSize - compressedSize) / originalSize) * 100)
  }

  function clearFile() {
    setFile(null)
    setPreview(null)
    setCompressedPreview(null)
    setOriginalSize(0)
    setCompressedSize(0)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="image-file">Subir imagen</FieldLabel>
        <input
          id="image-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={inputClass()}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Formatos soportados: JPG, PNG, WebP. Todo el procesamiento es local en tu navegador.
        </p>
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">Tamaño original: {formatFileSize(originalSize)}</p>
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
                alt="Imagen original antes de comprimir"
                className="max-h-64 w-auto rounded-lg border border-border"
              />
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="quality">Calidad: {quality}%</FieldLabel>
              <input
                id="quality"
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <FieldLabel htmlFor="format">Formato de salida</FieldLabel>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value as "webp" | "jpeg" | "png")}
                className={inputClass()}
              >
                <option value="webp">WebP (recomendado)</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <ActionButton onClick={compressImage} disabled={isProcessing}>
              {isProcessing ? "Procesando..." : "Comprimir imagen"}
            </ActionButton>
          </div>
        </Panel>
      )}

      {compressedPreview && (
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Imagen comprimida</p>
              <p className="text-xs text-muted-foreground">
                Tamaño: {formatFileSize(compressedSize)} (reducción del {calculateReduction()}%)
              </p>
            </div>
            <ActionButton onClick={downloadCompressed} variant="outline">
              <Download className="size-4" />
              Descargar
            </ActionButton>
          </div>

          <div className="mt-4 flex justify-center">
            <img
              src={compressedPreview}
              alt="Imagen comprimida resultado"
              className="max-h-64 w-auto rounded-lg border border-border"
            />
          </div>
        </Panel>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
