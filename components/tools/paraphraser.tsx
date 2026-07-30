"use client"

import { useState } from "react"
import { RefreshCw, Copy, Check, Sparkles, AlertCircle } from "lucide-react"
import { ActionButton, FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"
import { sanitizeInput, secureInput } from "@/lib/security"

export function Paraphraser() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isParaphrasing, setIsParaphrasing] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paraphraseText = async () => {
    if (!inputText.trim() || isParaphrasing || isCooldown) return

    // Sanitizar input
    const { sanitized, isValid } = secureInput(inputText, {
      maxLength: 10000,
      minLength: 1
    })

    if (!isValid) {
      setError("El texto contiene caracteres no permitidos o excede el límite de longitud.")
      return
    }

    setIsParaphrasing(true)
    setIsCooldown(true)
    setError(null)
    
    try {
      const prompt = `Parafrasea el siguiente texto manteniendo el mismo significado pero usando palabras diferentes. Solo devuelve el texto parafraseado, sin explicaciones adicionales:\n\n${inputText}`
      
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al parafrasear el texto")
      }

      const data = await response.json()
      setOutputText(data.text.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al parafrasear el texto. Intenta de nuevo.")
    } finally {
      setIsParaphrasing(false)
      // Cooldown de 5 segundos para evitar saturar la API
      setTimeout(() => setIsCooldown(false), 5000)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="input-text">Texto original</FieldLabel>
        <textarea
          id="input-text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe o pega el texto que quieres parafrasear..."
          className={textAreaClass()}
          rows={6}
        />

        <div className="mt-4 flex gap-2">
          <ActionButton onClick={paraphraseText} disabled={!inputText.trim() || isParaphrasing || isCooldown}>
            {isParaphrasing ? (
              <>
                <RefreshCw className="size-4 animate-spin" /> Parafraseando…
              </>
            ) : isCooldown ? (
              <>
                <RefreshCw className="size-4" /> Espera 5s…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Parafrasear
              </>
            )}
          </ActionButton>
          <button
            onClick={() => {
              setInputText("")
              setOutputText("")
              setError(null)
              setIsCooldown(false)
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Limpiar
          </button>
        </div>
      </Panel>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {outputText && (
        <Panel>
          <div className="flex items-center justify-between mb-4">
            <FieldLabel htmlFor="output-text">Texto parafraseado</FieldLabel>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              {copied ? (
                <>
                  <Check className="size-4" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Copiar
                </>
              )}
            </button>
          </div>
          <textarea
            id="output-text"
            value={outputText}
            readOnly
            className={textAreaClass()}
            rows={6}
          />
        </Panel>
      )}

      <p className="text-xs text-muted-foreground">
        El parafraseo se realiza usando Google AI (Gemini 3.5 Flash Lite). Hay un límite de 5 segundos entre peticiones para no saturar la API.
      </p>
    </div>
  )
}
