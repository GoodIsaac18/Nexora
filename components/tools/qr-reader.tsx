"use client"

import { useState, useRef, useEffect } from "react"
import { Scan, Upload, Camera, Copy, Check, X } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import { ActionButton, FieldLabel, Panel } from "@/components/tools/ui"

export function QrReader() {
  const [result, setResult] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [useCamera, setUseCamera] = useState(false)
  const qrRef = useRef<Html5Qrcode | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (qrRef.current && isScanning) {
        qrRef.current.stop().catch(console.error)
      }
    }
  }, [isScanning])

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      // Detener el stream inmediatamente después de obtener permiso
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (err) {
      console.error("Permission denied:", err)
      return false
    }
  }

  const startCamera = async () => {
    setError(null)
    setResult("")
    
    // Primero solicitar permisos explícitamente
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      setError("No se pudo obtener permiso de cámara. Por favor permite el acceso a la cámara en tu navegador y recarga la página.")
      return
    }
    
    // Limpiar cualquier instancia anterior
    if (qrRef.current) {
      try {
        await qrRef.current.stop()
        qrRef.current = null
      } catch (err) {
        console.error("Error cleaning up previous scanner:", err)
        qrRef.current = null
      }
    }

    setIsScanning(true)

    try {
      const html5QrCode = new Html5Qrcode("qr-reader")
      qrRef.current = html5QrCode

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      }

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          setResult(decodedText)
          setIsScanning(false)
          html5QrCode.stop().catch(console.error)
        },
        (errorMessage) => {
          // Ignorar errores de escaneo normales
        }
      )
    } catch (err) {
      console.error("Camera error:", err)
      setError("No se pudo acceder a la cámara. Por favor verifica los permisos de cámara en tu navegador.")
      setIsScanning(false)
      if (qrRef.current) {
        qrRef.current = null
      }
    }
  }

  const stopCamera = async () => {
    if (qrRef.current) {
      try {
        await qrRef.current.stop()
        qrRef.current = null
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
    }
    setIsScanning(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setResult("")

    const html5QrCode = new Html5Qrcode("qr-reader")
    qrRef.current = html5QrCode

    html5QrCode
      .scanFile(file, true)
      .then((decodedText) => {
        setResult(decodedText)
      })
      .catch((err) => {
        setError("No se pudo leer el código QR de la imagen.")
      })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clear = () => {
    setResult("")
    setError(null)
    setCopied(false)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 sm:px-0">
      <Panel>
        <FieldLabel htmlFor="qr-reader">Escáner de Código QR</FieldLabel>

        <div className="mb-4">
          <div id="qr-reader" className="w-full min-h-[300px] bg-muted rounded-lg overflow-hidden" />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          {!isScanning ? (
            <>
              <button
                onClick={startCamera}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 sm:h-12 sm:px-8"
              >
                <Camera className="size-4" />
                Usar Cámara
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted active:scale-95 sm:h-12 sm:px-8"
              >
                <Upload className="size-4" />
                Subir Imagen
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          ) : (
            <button
              onClick={stopCamera}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-6 text-sm font-medium text-destructive-foreground transition-all hover:bg-destructive/90 active:scale-95 sm:h-12 sm:px-8"
            >
              <X className="size-4" />
              Detener Cámara
            </button>
          )}
          <button
            onClick={clear}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted active:scale-95 sm:h-12 sm:px-8"
          >
            Limpiar
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4 mb-4">
            <X className="size-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Scan className="size-5 text-primary" />
                <h3 className="font-semibold">Resultado</h3>
              </div>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                {copied ? (
                  <>
                    <Check className="size-4 text-green-500" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <div className="bg-muted rounded-lg p-3 break-all">
              <p className="text-sm">{result}</p>
            </div>
            {result.startsWith("http") && (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
              >
                Abrir enlace
              </a>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
