"use client"

import { useState, useRef, useEffect } from "react"
import { Wifi, Upload, Camera, Copy, Check, X, Lock, Shield } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import { ActionButton, FieldLabel, Panel } from "@/components/tools/ui"

interface WiFiCredentials {
  ssid: string
  password: string
  encryption: string
  hidden: boolean
}

export function WifiQrReader() {
  const [result, setResult] = useState<WiFiCredentials | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<Html5Qrcode | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (qrRef.current && isScanning) {
        qrRef.current.stop().catch(console.error)
      }
    }
  }, [isScanning])

  const parseWiFiString = (qrData: string): WiFiCredentials | null => {
    try {
      // WiFi QR format: WIFI:S:MySSID;T:WPA;P:MyPass;H:false;;
      if (!qrData.startsWith("WIFI:")) {
        return null
      }

      const data: Partial<WiFiCredentials> = {
        ssid: "",
        password: "",
        encryption: "WPA",
        hidden: false,
      }

      const parts = qrData.slice(5).split(";")
      for (const part of parts) {
        if (part.startsWith("S:")) {
          data.ssid = part.slice(2)
        } else if (part.startsWith("T:")) {
          data.encryption = part.slice(2)
        } else if (part.startsWith("P:")) {
          data.password = part.slice(2)
        } else if (part.startsWith("H:")) {
          data.hidden = part.slice(2) === "true"
        }
      }

      if (!data.ssid) return null

      return data as WiFiCredentials
    } catch {
      return null
    }
  }

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
    setResult(null)
    
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
      const html5QrCode = new Html5Qrcode("wifi-qr-reader")
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
          const wifiData = parseWiFiString(decodedText)
          if (wifiData) {
            setResult(wifiData)
            setIsScanning(false)
            html5QrCode.stop().catch(console.error)
          } else {
            setError("El código QR escaneado no es un código WiFi válido.")
          }
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
    setResult(null)

    const html5QrCode = new Html5Qrcode("wifi-qr-reader")
    qrRef.current = html5QrCode

    html5QrCode
      .scanFile(file, true)
      .then((decodedText) => {
        const wifiData = parseWiFiString(decodedText)
        if (wifiData) {
          setResult(wifiData)
        } else {
          setError("El código QR no es un código WiFi válido.")
        }
      })
      .catch((err) => {
        setError("No se pudo leer el código QR de la imagen.")
      })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clear = () => {
    setResult(null)
    setError(null)
    setCopied(false)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 sm:px-0">
      <Panel>
        <FieldLabel htmlFor="wifi-qr-reader">Escáner de Código QR WiFi</FieldLabel>

        <div className="mb-4">
          <div id="wifi-qr-reader" className="w-full min-h-[300px] bg-muted rounded-lg overflow-hidden" />
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
            <div className="flex items-center gap-2 mb-4">
              <Wifi className="size-5 text-primary" />
              <h3 className="font-semibold">Credenciales WiFi</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">SSID (Nombre de red)</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-lg p-3">
                    <p className="text-sm">{result.ssid}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.ssid)}
                    className="inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Contraseña</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-lg p-3">
                    <p className="text-sm font-mono">{result.password || "(Sin contraseña)"}</p>
                  </div>
                  {result.password && (
                    <button
                      onClick={() => copyToClipboard(result.password)}
                      className="inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-muted"
                    >
                      {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Encriptación</label>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">{result.encryption}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Red oculta</label>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">{result.hidden ? "Sí" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/10 p-3">
              <Shield className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Estas credenciales se han extraído de un código QR. Úsalas con precaución y compártelas solo con personas de confianza.
              </p>
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}
