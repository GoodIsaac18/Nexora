"use client"

import { useState, useRef } from "react"
import { Download, Upload, FileText, Minimize, Loader2, AlertCircle, Gauge } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

type CompressionLevel = "low" | "medium" | "high"

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium")
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (selected.type !== "application/pdf") {
        setError("Por favor selecciona un archivo PDF válido.")
        setFile(null)
        return
      }
      setFile(selected)
      setOriginalSize(selected.size)
      setError(null)
      setDownloadUrl(null)
      setCompressedSize(0)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      if (dropped.type !== "application/pdf") {
        setError("Por favor selecciona un archivo PDF válido.")
        setFile(null)
        return
      }
      setFile(dropped)
      setOriginalSize(dropped.size)
      setError(null)
      setDownloadUrl(null)
      setCompressedSize(0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const compressPdf = async () => {
    if (!file) return

    setCompressing(true)
    setError(null)
    setDownloadUrl(null)
    setCompressedSize(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("level", compressionLevel)

      const response = await fetch("/api/pdf/compress", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al comprimir el PDF")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setCompressedSize(blob.size)
      
      // Verificar si hay nota de compresión
      const compressionNote = response.headers.get("X-Compression-Note")
      if (compressionNote) {
        setError(compressionNote)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al comprimir el archivo. Intenta de nuevo.")
    } finally {
      setCompressing(false)
    }
  }

  const handleDownload = () => {
    if (!downloadUrl || !file) return

    const a = document.createElement("a")
    a.href = downloadUrl
    const baseName = file.name.replace(/\.[^/.]+$/, "")
    a.download = `${baseName}-compressed.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const resetCompressor = () => {
    setFile(null)
    setCompressionLevel("medium")
    setError(null)
    setDownloadUrl(null)
    setOriginalSize(0)
    setCompressedSize(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB"
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(2)} MB`
    return `${kb.toFixed(0)} KB`
  }

  const getCompressionPercentage = () => {
    if (originalSize === 0 || compressedSize === 0) return 0
    return Math.round(((originalSize - compressedSize) / originalSize) * 100)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="file-upload">Seleccionar archivo PDF</FieldLabel>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="size-8 text-primary" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arrastra un PDF aquí o haz clic para seleccionar
              </p>
            </div>
          )}
        </div>

        {file && (
          <>
            <div className="mt-4">
              <FieldLabel htmlFor="compression-level">Nivel de compresión</FieldLabel>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCompressionLevel("low")}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    compressionLevel === "low"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <Gauge className="size-5" />
                  <span className="text-sm font-medium">Baja</span>
                  <span className="text-xs text-muted-foreground">Mejor calidad</span>
                </button>
                <button
                  onClick={() => setCompressionLevel("medium")}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    compressionLevel === "medium"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <Gauge className="size-5" />
                  <span className="text-sm font-medium">Media</span>
                  <span className="text-xs text-muted-foreground">Balanceado</span>
                </button>
                <button
                  onClick={() => setCompressionLevel("high")}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    compressionLevel === "high"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <Gauge className="size-5" />
                  <span className="text-sm font-medium">Alta</span>
                  <span className="text-xs text-muted-foreground">Menor tamaño</span>
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <ActionButton onClick={compressPdf} disabled={compressing}>
                {compressing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Comprimiendo…
                  </>
                ) : (
                  <>
                    <Minimize className="size-4" /> Comprimir PDF
                  </>
                )}
              </ActionButton>
              <button
                onClick={resetCompressor}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          La compresión optimiza la estructura del PDF. Algunos archivos ya están optimizados y no se pueden reducir más.
        </p>
      </Panel>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {downloadUrl && (
        <Panel className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Download className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">¡Compresión completada!</p>
              <p className="text-sm text-muted-foreground">
                {formatSize(originalSize)} → {formatSize(compressedSize)} ({getCompressionPercentage()}% reducción)
              </p>
            </div>
          </div>
          <ActionButton onClick={handleDownload}>
            <Download className="size-4" /> Descargar PDF comprimido
          </ActionButton>
        </Panel>
      )}
    </div>
  )
}
