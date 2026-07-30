"use client"

import { useState, useRef } from "react"
import { Download, Upload, FileText, Unlock, Loader2, AlertCircle, KeyRound } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

export function PdfUnlocker() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [unlocking, setUnlocking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
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
      setDownloadUrl(null)
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
      setDownloadUrl(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const unlockPdf = async () => {
    if (!file || !password) return

    setUnlocking(true)
    setError(null)
    setDownloadUrl(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("password", password)

      const response = await fetch("/api/pdf/unlock", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al desbloquear el PDF")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al desbloquear el archivo. Verifica la contraseña e intenta de nuevo.")
    } finally {
      setUnlocking(false)
    }
  }

  const handleDownload = () => {
    if (!downloadUrl || !file) return

    const a = document.createElement("a")
    a.href = downloadUrl
    const baseName = file.name.replace(/\.[^/.]+$/, "")
    a.download = `${baseName}-unlocked.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const resetUnlocker = () => {
    setFile(null)
    setPassword("")
    setError(null)
    setDownloadUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="file-upload">Seleccionar archivo PDF protegido</FieldLabel>
        
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
              <FieldLabel htmlFor="password">Contraseña del PDF</FieldLabel>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña del PDF..."
                  className={inputClass("pl-10")}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <ActionButton onClick={unlockPdf} disabled={unlocking || !password}>
                {unlocking ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Desbloqueando…
                  </>
                ) : (
                  <>
                    <Unlock className="size-4" /> Desbloquear PDF
                  </>
                )}
              </ActionButton>
              <button
                onClick={resetUnlocker}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Solo funciona con PDFs que conoces la contraseña. El procesamiento se realiza en el servidor.
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
              <p className="font-medium">¡PDF desbloqueado exitosamente!</p>
              <p className="text-sm text-muted-foreground">
                Tu PDF ya no tiene protección de contraseña
              </p>
            </div>
          </div>
          <ActionButton onClick={handleDownload}>
            <Download className="size-4" /> Descargar PDF desbloqueado
          </ActionButton>
        </Panel>
      )}
    </div>
  )
}
