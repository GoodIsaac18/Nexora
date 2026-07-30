"use client"

import { useState, useRef } from "react"
import { Download, FileText, X, Type as TypeIcon } from "lucide-react"
import { ActionButton, FieldLabel, Panel, inputClass } from "@/components/tools/ui"

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text")
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL")
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null)
  const [opacity, setOpacity] = useState(30)
  const [fontSize, setFontSize] = useState(48)
  const [rotation, setRotation] = useState(45)
  const [isProcessing, setIsProcessing] = useState(false)
  const [watermarkedPdf, setWatermarkedPdf] = useState<Blob | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      alert("Por favor selecciona un archivo PDF")
      return
    }

    setFile(selectedFile)
    setWatermarkedPdf(null)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    setWatermarkImage(selectedFile)
  }

  async function addWatermark() {
    if (!file) return

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", watermarkType)
      formData.append("opacity", opacity.toString())
      formData.append("rotation", rotation.toString())

      if (watermarkType === "text") {
        formData.append("text", watermarkText)
        formData.append("fontSize", fontSize.toString())
      } else if (watermarkImage) {
        formData.append("image", watermarkImage)
      }

      const response = await fetch("/api/pdf/watermark", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al añadir marca de agua")
      }

      const blob = await response.blob()
      setWatermarkedPdf(blob)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al procesar el PDF")
    } finally {
      setIsProcessing(false)
    }
  }

  function downloadWatermarked() {
    if (!watermarkedPdf || !file) return

    const url = URL.createObjectURL(watermarkedPdf)
    const link = document.createElement("a")
    link.href = url
    link.download = file.name.replace(".pdf", "_watermarked.pdf")
    link.click()
    URL.revokeObjectURL(url)
  }

  function clearFile() {
    setFile(null)
    setWatermarkedPdf(null)
    setWatermarkImage(null)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="pdf-file">Subir PDF</FieldLabel>
        <input
          id="pdf-file"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className={inputClass()}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Añade marcas de agua de texto o imagen a tus documentos PDF.
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

          <div className="mt-4">
            <FieldLabel htmlFor="watermark-type">Tipo de marca de agua</FieldLabel>
            <select
              id="watermark-type"
              value={watermarkType}
              onChange={(e) => setWatermarkType(e.target.value as "text" | "image")}
              className={inputClass()}
            >
              <option value="text">Texto</option>
              <option value="image">Imagen</option>
            </select>
          </div>

          {watermarkType === "text" && (
            <div className="mt-4">
              <FieldLabel htmlFor="watermark-text">Texto de marca de agua</FieldLabel>
              <input
                id="watermark-text"
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className={inputClass()}
              />
            </div>
          )}

          {watermarkType === "image" && (
            <div className="mt-4">
              <FieldLabel htmlFor="watermark-image">Imagen de marca de agua</FieldLabel>
              <input
                id="watermark-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={inputClass()}
              />
              {watermarkImage && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Imagen seleccionada: {watermarkImage.name}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="opacity">Opacidad: {opacity}%</FieldLabel>
              <input
                id="opacity"
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <FieldLabel htmlFor="rotation">Rotación: {rotation}°</FieldLabel>
              <input
                id="rotation"
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {watermarkType === "text" && (
            <div className="mt-4">
              <FieldLabel htmlFor="font-size">Tamaño de fuente: {fontSize}px</FieldLabel>
              <input
                id="font-size"
                type="range"
                min="12"
                max="120"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="mt-4">
            <ActionButton
              onClick={addWatermark}
              disabled={isProcessing || (watermarkType === "image" && !watermarkImage)}
            >
              {isProcessing ? "Procesando..." : "Añadir marca de agua"}
            </ActionButton>
          </div>
        </Panel>
      )}

      {watermarkedPdf && (
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">PDF con marca de agua</p>
              <p className="text-xs text-muted-foreground">
                Listo para descargar
              </p>
            </div>
            <ActionButton onClick={downloadWatermarked} variant="outline">
              <Download className="size-4" />
              Descargar
            </ActionButton>
          </div>
        </Panel>
      )}
    </div>
  )
}
