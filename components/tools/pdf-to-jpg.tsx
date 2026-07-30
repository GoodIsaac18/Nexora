"use client"

import { useState, useRef } from "react"
import { Download, Upload, FileText, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrls, setDownloadUrls] = useState<string[]>([])
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
      setError(null)
      setDownloadUrls([])
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
      setError(null)
      setDownloadUrls([])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const convertFile = async () => {
    if (!file) return

    setConverting(true)
    setError(null)
    setDownloadUrls([])

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/pdf/to-jpg", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error en la conversión")
      }

      const data = await response.json()
      setDownloadUrls(data.urls || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al convertir el archivo. Intenta de nuevo.")
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = (url: string, index: number) => {
    const a = document.createElement("a")
    a.href = url
    const baseName = file?.name.replace(/\.[^/.]+$/, "") || "page"
    a.download = `${baseName}-page-${index + 1}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const resetConverter = () => {
    setFile(null)
    setError(null)
    setDownloadUrls([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
              <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
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
          <div className="mt-4 flex gap-2">
            <ActionButton onClick={convertFile} disabled={converting}>
              {converting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Convirtiendo…
                </>
              ) : (
                <>
                  <ImageIcon className="size-4" /> Convertir a JPG
                </>
              )}
            </ActionButton>
            <button
              onClick={resetConverter}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          La conversión se realiza en el servidor. Los archivos se eliminan después del procesamiento.
        </p>
      </Panel>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {downloadUrls.length > 0 && (
        <Panel className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Download className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">¡Conversión completada!</p>
              <p className="text-sm text-muted-foreground">
                {downloadUrls.length} página{downloadUrls.length > 1 ? "s" : ""} convertida{downloadUrls.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            {downloadUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => handleDownload(url, index)}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background p-3 text-left transition-colors hover:bg-muted"
              >
                <span className="text-sm">Página {index + 1}</span>
                <Download className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Panel>
      )}
    </div>
  )
}
