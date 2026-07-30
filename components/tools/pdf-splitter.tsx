"use client"

import { useState, useRef } from "react"
import { Download, Upload, FileText, Scissors, Loader2, AlertCircle, FileArchive } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

type SplitMode = "all" | "range"

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [splitMode, setSplitMode] = useState<SplitMode>("all")
  const [pageRange, setPageRange] = useState("")
  const [splitting, setSplitting] = useState(false)
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

  const splitPdf = async () => {
    if (!file) return

    if (splitMode === "range" && !pageRange.trim()) {
      setError("Por favor ingresa un rango de páginas válido.")
      return
    }

    setSplitting(true)
    setError(null)
    setDownloadUrls([])

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("mode", splitMode)
      if (splitMode === "range") {
        formData.append("range", pageRange)
      }

      const response = await fetch("/api/pdf/split", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al dividir el PDF")
      }

      const data = await response.json()
      setDownloadUrls(data.urls || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al dividir el archivo. Intenta de nuevo.")
    } finally {
      setSplitting(false)
    }
  }

  const handleDownload = (url: string, index: number) => {
    const a = document.createElement("a")
    a.href = url
    const baseName = file?.name.replace(/\.[^/.]+$/, "") || "page"
    a.download = `${baseName}-part-${index + 1}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const resetSplitter = () => {
    setFile(null)
    setSplitMode("all")
    setPageRange("")
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
          <>
            <div className="mt-4">
              <FieldLabel>Modo de división</FieldLabel>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSplitMode("all")}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    splitMode === "all"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <FileArchive className="size-5" />
                  <span className="text-sm font-medium">Todas las páginas</span>
                  <span className="text-xs text-muted-foreground">Una página por archivo</span>
                </button>
                <button
                  onClick={() => setSplitMode("range")}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    splitMode === "range"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <Scissors className="size-5" />
                  <span className="text-sm font-medium">Rango personalizado</span>
                  <span className="text-xs text-muted-foreground">Especifica páginas</span>
                </button>
              </div>
            </div>

            {splitMode === "range" && (
              <div className="mt-4">
                <FieldLabel htmlFor="page-range">Rango de páginas</FieldLabel>
                <input
                  id="page-range"
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="Ej: 1-3, 5, 7-9"
                  className={inputClass()}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Usa guiones para rangos (1-5) y comas para páginas individuales (1,3,5)
                </p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <ActionButton onClick={splitPdf} disabled={splitting}>
                {splitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Dividiendo…
                  </>
                ) : (
                  <>
                    <Scissors className="size-4" /> Dividir PDF
                  </>
                )}
              </ActionButton>
              <button
                onClick={resetSplitter}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          El procesamiento se realiza en el servidor. Los archivos se eliminan después del procesamiento.
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
              <p className="font-medium">¡División completada!</p>
              <p className="text-sm text-muted-foreground">
                {downloadUrls.length} archivo{downloadUrls.length > 1 ? "s" : ""} generado{downloadUrls.length > 1 ? "s" : ""}
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
                <span className="text-sm">Parte {index + 1}</span>
                <Download className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Panel>
      )}
    </div>
  )
}
