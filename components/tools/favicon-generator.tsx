"use client"

import { useState, useRef } from "react"
import { Download, Star, X, Copy } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"
import { CopyButton } from "@/components/copy-button"

interface GeneratedIcon {
  size: number
  dataUrl: string
  name: string
}

export function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([])
  const [htmlCode, setHtmlCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const iconSizes = [16, 32, 48, 64, 128, 192, 512]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    setFile(selectedFile)
    setGeneratedIcons([])
    setHtmlCode("")

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  async function generateFavicons() {
    if (!file || !preview || !canvasRef.current) return

    setIsProcessing(true)
    const icons: GeneratedIcon[] = []

    const img = new Image()
    img.onload = () => {
      for (const size of iconSizes) {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext("2d")!

        canvas.width = size
        canvas.height = size

        // Draw image centered and scaled to fit
        const scale = Math.min(size / img.width, size / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const x = (size - scaledWidth) / 2
        const y = (size - scaledHeight) / 2

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

        const dataUrl = canvas.toDataURL("image/png")
        icons.push({
          size,
          dataUrl,
          name: `favicon-${size}x${size}.png`
        })
      }

      setGeneratedIcons(icons)

      // Generate HTML code
      const code = `<!-- Favicon HTML Code -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">
<link rel="icon" type="image/png" sizes="128x128" href="/favicon-128x128.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-192x192.png">
<meta name="theme-color" content="#000000">`

      setHtmlCode(code)
      setIsProcessing(false)
    }
    img.src = preview
  }

  function downloadIcon(icon: GeneratedIcon) {
    const link = document.createElement("a")
    link.href = icon.dataUrl
    link.download = icon.name
    link.click()
  }

  function downloadAll() {
    generatedIcons.forEach((icon, index) => {
      setTimeout(() => downloadIcon(icon), index * 200)
    })
  }

  function clearFile() {
    setFile(null)
    setPreview(null)
    setGeneratedIcons([])
    setHtmlCode("")
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="image-file">Subir logo o imagen</FieldLabel>
        <input
          id="image-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={inputClass()}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Genera un paquete completo de favicons en múltiples tamaños para web, iOS y Android.
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
                alt="Original"
                className="max-h-48 w-auto rounded-lg border border-border"
              />
            </div>
          )}

          <div className="mt-4">
            <ActionButton onClick={generateFavicons} disabled={isProcessing}>
              {isProcessing ? "Generando favicons..." : "Generar paquete de favicons"}
            </ActionButton>
          </div>
        </Panel>
      )}

      {generatedIcons.length > 0 && (
        <>
          <Panel>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium">Favicons generados</h3>
              <ActionButton onClick={downloadAll} variant="outline">
                <Download className="size-4" />
                Descargar todos
              </ActionButton>
            </div>

            <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
              {generatedIcons.map((icon) => (
                <div key={icon.size} className="flex flex-col items-center gap-2">
                  <img
                    src={icon.dataUrl}
                    alt={`${icon.size}x${icon.size}`}
                    className="size-12 rounded border border-border"
                    style={{ width: icon.size, height: icon.size, maxWidth: "64px", maxHeight: "64px" }}
                  />
                  <span className="text-xs text-muted-foreground">{icon.size}px</span>
                  <button
                    onClick={() => downloadIcon(icon)}
                    className="text-xs text-primary hover:underline"
                  >
                    Descargar
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Código HTML para implementar</h3>
              <CopyButton value={htmlCode} />
            </div>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-xs">
              <code>{htmlCode}</code>
            </pre>
            <p className="mt-2 text-xs text-muted-foreground">
              Copia este código y pégalo en la sección &lt;head&gt; de tu HTML. Sube los archivos PNG a la carpeta raíz de tu sitio web.
            </p>
          </Panel>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
