"use client"

import { useState, useRef } from "react"
import { Download, Crop, X } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

const presets = [
  { name: "Instagram Square", width: 1080, height: 1080, aspect: "1:1" },
  { name: "Instagram Portrait", width: 1080, height: 1350, aspect: "4:5" },
  { name: "Twitter Post", width: 1200, height: 675, aspect: "16:9" },
  { name: "Twitter Header", width: 1500, height: 500, aspect: "3:1" },
  { name: "Facebook Post", width: 1200, height: 630, aspect: "1.91:1" },
  { name: "LinkedIn Post", width: 1200, height: 627, aspect: "1.91:1" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, aspect: "16:9" },
  { name: "Custom", width: 0, height: 0, aspect: "custom" },
]

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [resizedPreview, setResizedPreview] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [customWidth, setCustomWidth] = useState(800)
  const [customHeight, setCustomHeight] = useState(600)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const currentPreset = presets[selectedPreset]
  const targetWidth = currentPreset.aspect === "custom" ? customWidth : currentPreset.width
  const targetHeight = currentPreset.aspect === "custom" ? customHeight : currentPreset.height

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    setFile(selectedFile)
    setResizedPreview(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  async function resizeImage() {
    if (!file || !preview || !canvasRef.current) return

    setIsProcessing(true)

    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext("2d")!

      canvas.width = targetWidth
      canvas.height = targetHeight

      // Calculate scaling to fit image within target dimensions
      const scale = Math.min(targetWidth / img.width, targetHeight / img.height)
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale

      // Center the image
      const x = (targetWidth - scaledWidth) / 2
      const y = (targetHeight - scaledHeight) / 2

      // Fill background with white
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setResizedPreview(dataUrl)
      setIsProcessing(false)
    }
    img.src = preview
  }

  function downloadResized() {
    if (!resizedPreview) return

    const link = document.createElement("a")
    link.href = resizedPreview
    link.download = file?.name.replace(/\.[^/.]+$/, "") + `_resized_${targetWidth}x${targetHeight}.jpg`
    link.click()
  }

  function clearFile() {
    setFile(null)
    setPreview(null)
    setResizedPreview(null)
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
          Redimensiona imágenes para redes sociales o dimensiones personalizadas.
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
                alt="Imagen original antes de redimensionar"
                className="max-h-64 w-auto rounded-lg border border-border"
              />
            </div>
          )}

          <div className="mt-4">
            <FieldLabel htmlFor="preset">Preset de tamaño</FieldLabel>
            <select
              id="preset"
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(parseInt(e.target.value))}
              className={inputClass()}
            >
              {presets.map((preset, index) => (
                <option key={index} value={index}>
                  {preset.name} ({preset.aspect === "custom" ? "Personalizado" : `${preset.width}x${preset.height}`})
                </option>
              ))}
            </select>
          </div>

          {selectedPreset === presets.length - 1 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="custom-width">Ancho (px)</FieldLabel>
                <input
                  id="custom-width"
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseInt(e.target.value) || 800)}
                  className={inputClass()}
                />
              </div>
              <div>
                <FieldLabel htmlFor="custom-height">Alto (px)</FieldLabel>
                <input
                  id="custom-height"
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseInt(e.target.value) || 600)}
                  className={inputClass()}
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <ActionButton onClick={resizeImage} disabled={isProcessing}>
              {isProcessing ? "Procesando..." : "Redimensionar imagen"}
            </ActionButton>
          </div>
        </Panel>
      )}

      {resizedPreview && (
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Imagen redimensionada</p>
              <p className="text-xs text-muted-foreground">
                Dimensiones: {targetWidth}x{targetHeight}px
              </p>
            </div>
            <ActionButton onClick={downloadResized} variant="outline">
              <Download className="size-4" />
              Descargar
            </ActionButton>
          </div>

          <div className="mt-4 flex justify-center">
            <img
              src={resizedPreview}
              alt="Imagen redimensionada resultado"
              className="max-h-64 w-auto rounded-lg border border-border"
            />
          </div>
        </Panel>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
