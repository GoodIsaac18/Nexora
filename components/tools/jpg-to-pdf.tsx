"use client"

import { useState, useRef } from "react"
import { Download, Upload, FileText, Image as ImageIcon, Loader2, AlertCircle, X } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

export function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    const imageFiles = selected.filter(f => f.type.startsWith("image/"))
    
    if (imageFiles.length === 0) {
      setError("Por favor selecciona archivos de imagen válidos (JPG, PNG, etc.).")
      return
    }
    
    setFiles(prev => [...prev, ...imageFiles])
    setError(null)
    setDownloadUrl(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files || [])
    const imageFiles = dropped.filter(f => f.type.startsWith("image/"))
    
    if (imageFiles.length === 0) {
      setError("Por favor selecciona archivos de imagen válidos (JPG, PNG, etc.).")
      return
    }
    
    setFiles(prev => [...prev, ...imageFiles])
    setError(null)
    setDownloadUrl(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const moveFile = (fromIndex: number, toIndex: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      const [removed] = newFiles.splice(fromIndex, 1)
      newFiles.splice(toIndex, 0, removed)
      return newFiles
    })
  }

  const convertFile = async () => {
    if (files.length === 0) return

    setConverting(true)
    setError(null)
    setDownloadUrl(null)

    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`files`, file)
      })

      const response = await fetch("/api/pdf/to-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error en la conversión")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al convertir el archivo. Intenta de nuevo.")
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!downloadUrl) return

    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = "converted.pdf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const resetConverter = () => {
    setFiles([])
    setError(null)
    setDownloadUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="file-upload">Seleccionar imágenes</FieldLabel>
        
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
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-2">
            <Upload className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WebP, etc. - Múltiples archivos permitidos</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <FieldLabel>Imágenes seleccionadas ({files.length})</FieldLabel>
            <p className="text-xs text-muted-foreground mb-2">Arrastra para reordenar el orden en el PDF</p>
            <div className="flex flex-col gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", index.toString())}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"))
                    moveFile(fromIndex, index)
                  }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <ImageIcon className="size-5 text-muted-foreground cursor-move" />
                  <span className="flex-1 text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="rounded-lg p-1 hover:bg-muted"
                  >
                    <X className="size-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <ActionButton onClick={convertFile} disabled={converting || files.length === 0}>
                {converting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Convirtiendo…
                  </>
                ) : (
                  <>
                    <FileText className="size-4" /> Crear PDF
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
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Las imágenes se combinarán en el orden mostrado. El procesamiento se realiza en el servidor.
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
              <p className="font-medium">¡PDF creado exitosamente!</p>
              <p className="text-sm text-muted-foreground">
                {files.length} imagen{files.length > 1 ? "es" : ""} combinada{files.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <ActionButton onClick={handleDownload}>
            <Download className="size-4" /> Descargar PDF
          </ActionButton>
        </Panel>
      )}
    </div>
  )
}
