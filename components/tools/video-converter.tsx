"use client"

import { useState, useRef } from "react"
import { Download, Upload, FileVideo, Music, Video, Loader2, AlertCircle } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

type ConversionFormat = "mp3" | "mp4" | "webm" | "m4a"

interface ConversionOption {
  id: ConversionFormat
  label: string
  icon: typeof FileVideo | typeof Music
  description: string
}

const conversionOptions: ConversionOption[] = [
  { id: "mp3", label: "MP3", icon: Music, description: "Audio only - Best for music" },
  { id: "m4a", label: "M4A", icon: Music, description: "Audio only - Apple format" },
  { id: "mp4", label: "MP4", icon: Video, description: "Video - Universal format" },
  { id: "webm", label: "WebM", icon: Video, description: "Video - Web optimized" },
]

export function VideoConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>("mp3")
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.type.startsWith("video/") && !selected.type.startsWith("audio/")) {
        setError("Por favor selecciona un archivo de video o audio válido.")
        setFile(null)
        return
      }
      setFile(selected)
      setError(null)
      setDownloadUrl(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      if (!dropped.type.startsWith("video/") && !dropped.type.startsWith("audio/")) {
        setError("Por favor selecciona un archivo de video o audio válido.")
        setFile(null)
        return
      }
      setFile(dropped)
      setError(null)
      setDownloadUrl(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const convertFile = async () => {
    if (!file) return

    setConverting(true)
    setError(null)
    setDownloadUrl(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("format", selectedFormat)

      const response = await fetch("/api/media/convert", {
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
    if (!downloadUrl || !file) return

    const a = document.createElement("a")
    a.href = downloadUrl
    const baseName = file.name.replace(/\.[^/.]+$/, "")
    a.download = `${baseName}.${selectedFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const resetConverter = () => {
    setFile(null)
    setSelectedFormat("mp3")
    setError(null)
    setDownloadUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="file-upload">Seleccionar archivo</FieldLabel>
        
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
            accept="video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileVideo className="size-8 text-primary" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arrastra un archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">MP4, WebM, MOV, AVI, MP3, etc.</p>
            </div>
          )}
        </div>

        {file && (
          <>
            <div className="mt-6">
              <FieldLabel htmlFor="format-select">Formato de salida</FieldLabel>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {conversionOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedFormat(option.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                        selectedFormat === option.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <Icon className="size-5" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <ActionButton onClick={convertFile} disabled={converting}>
                {converting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Convirtiendo…
                  </>
                ) : (
                  <>
                    <Video className="size-4" /> Convertir
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
          </>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          La conversión se realiza en el servidor. Los archivos se eliminan después de la conversión.
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
              <p className="font-medium">¡Conversión completada!</p>
              <p className="text-sm text-muted-foreground">
                Tu archivo está listo para descargar en formato {selectedFormat.toUpperCase()}
              </p>
            </div>
          </div>
          <ActionButton onClick={handleDownload}>
            <Download className="size-4" /> Descargar archivo
          </ActionButton>
        </Panel>
      )}
    </div>
  )
}
