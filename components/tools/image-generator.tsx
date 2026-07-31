"use client"

import { useState } from "react"
import { Image as ImageIcon, Sparkles, Download, AlertCircle, Loader2 } from "lucide-react"
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
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="prompt" className="block text-xs sm:text-sm font-medium mb-2">Describe la imagen que quieres generar</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Un gato astronauta flotando en el espacio con estrellas de fondo, estilo digital art..."
          className="rounded-xl border border-border bg-background px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none w-full"
          rows={4}
          maxLength={500}
        />

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
          <button onClick={generateImage} disabled={!prompt.trim() || isGenerating || isCooldown} className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 sm:px-6 text-xs sm:text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 w-full sm:w-auto">
            {isGenerating ? (
              <>
                <Loader2 className="size-3 sm:size-4 animate-spin" /> Generando…
              </>
            ) : isCooldown ? (
              <>
                <Loader2 className="size-3 sm:size-4" /> Espera 5s…
              </>
            ) : (
              <>
                <Sparkles className="size-3 sm:size-4" /> Generar imagen
              </>
            )}
          </button>
          <button
            onClick={() => {
              setPrompt("")
              setGeneratedImage(null)
              setError(null)
              setIsCooldown(false)
            }}
            className="inline-flex h-10 sm:h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-background px-4 sm:px-6 text-xs sm:text-sm font-medium transition-colors hover:bg-muted"
          >
            Limpiar
          </button>
        </div>

        {prompt.length > 0 && (
          <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
            {prompt.length}/500 caracteres
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-3 sm:p-4">
          <AlertCircle className="size-3 sm:size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-destructive">{error}</p>
        </div>
      )}

      {generatedImage && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <label htmlFor="generated-image" className="text-xs sm:text-sm font-medium">Imagen generada</label>
            <button
              onClick={downloadImage}
              className="inline-flex items-center gap-2 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-muted"
            >
              <Download className="size-3 sm:size-4" /> Descargar
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
        </div>
      )}

      <p className="text-[10px] sm:text-xs text-muted-foreground">
        La generación de imágenes se realiza usando Google AI (Gemini). Hay un límite de 5 segundos entre peticiones para no saturar la API.
      </p>
    </div>
  )
}
