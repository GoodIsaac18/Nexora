"use client"

import { useState } from "react"
import { Image as ImageIcon, Sparkles, Download, AlertCircle, Loader2 } from "lucide-react"
import { ActionButton, FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"
import { secureInput } from "@/lib/security"

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async () => {
    if (!prompt.trim() || isGenerating || isCooldown) return

    // Sanitizar input
    const { sanitized, isValid } = secureInput(prompt, {
      maxLength: 500,
      minLength: 10
    })

    if (!isValid) {
      setError("El prompt contiene caracteres no permitidos o es muy corto (mínimo 10 caracteres).")
      return
    }

    setIsGenerating(true)
    setIsCooldown(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: sanitized })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al generar la imagen")
      }

      const data = await response.json()
      setGeneratedImage(data.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar la imagen. Intenta de nuevo.")
    } finally {
      setIsGenerating(false)
      setTimeout(() => setIsCooldown(false), 5000)
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `nexora-generated-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 sm:px-0">
      <Panel>
        <FieldLabel htmlFor="prompt">Describe la imagen que quieres generar</FieldLabel>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Un gato astronauta flotando en el espacio con estrellas de fondo, estilo digital art..."
          className={textAreaClass()}
          rows={4}
          maxLength={500}
        />

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <ActionButton onClick={generateImage} disabled={!prompt.trim() || isGenerating || isCooldown} className="w-full sm:w-auto">
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generando…
              </>
            ) : isCooldown ? (
              <>
                <Loader2 className="size-4" /> Espera 5s…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generar imagen
              </>
            )}
          </ActionButton>
          <button
            onClick={() => {
              setPrompt("")
              setGeneratedImage(null)
              setError(null)
              setIsCooldown(false)
            }}
            className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Limpiar
          </button>
        </div>

        {prompt.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {prompt.length}/500 caracteres
          </p>
        )}
      </Panel>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {generatedImage && (
        <Panel>
          <div className="flex items-center justify-between mb-4">
            <FieldLabel htmlFor="generated-image">Imagen generada</FieldLabel>
            <button
              onClick={downloadImage}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Download className="size-4" /> Descargar
            </button>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-muted">
            <img
              id="generated-image"
              src={generatedImage}
              alt="Imagen generada"
              className="w-full h-auto"
            />
          </div>
        </Panel>
      )}

      <p className="text-xs text-muted-foreground">
        La generación de imágenes se realiza usando Google AI (Gemini). Hay un límite de 5 segundos entre peticiones para no saturar la API.
      </p>
    </div>
  )
}
