"use client"

import { useState } from "react"
import { Bot, BrainCircuit, AlertTriangle, CheckCircle, Search, AlertCircle } from "lucide-react"
import { ActionButton, FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"
import { secureInput } from "@/lib/security"

export function AiDetector() {
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [result, setResult] = useState<{
    aiProbability: number
    humanProbability: number
    analysis: string[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeText = async () => {
    if (!inputText.trim() || isAnalyzing || isCooldown) return

    // Sanitizar input
    const { sanitized, isValid } = secureInput(inputText, {
      maxLength: 10000,
      minLength: 50
    })

    if (!isValid) {
      setError("El texto contiene caracteres no permitidos o excede el límite de longitud.")
      return
    }

    setIsAnalyzing(true)
    setIsCooldown(true)
    setError(null)
    
    try {
      const prompt = `Analiza el siguiente texto y determina la probabilidad de que fue escrito por IA o por un humano. Devuelve el resultado en formato JSON con esta estructura exacta:
{
  "aiProbability": número entre 0 y 100,
  "humanProbability": número entre 0 y 100,
  "analysis": ["lista de 3-5 razones breves"]
}

Texto a analizar:
${inputText}`
      
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al analizar el texto")
      }

      const data = await response.json()
      
      // Parse JSON response
      const jsonMatch = data.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsedResult = JSON.parse(jsonMatch[0])
        setResult({
          aiProbability: Math.min(100, Math.max(0, parsedResult.aiProbability || 50)),
          humanProbability: Math.min(100, Math.max(0, parsedResult.humanProbability || 50)),
          analysis: parsedResult.analysis || []
        })
      } else {
        throw new Error("No se pudo parsear la respuesta de la IA")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar el texto. Intenta de nuevo.")
    } finally {
      setIsAnalyzing(false)
      // Cooldown de 5 segundos para evitar saturar la API
      setTimeout(() => setIsCooldown(false), 5000)
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability > 70) return "text-red-500"
    if (probability > 40) return "text-yellow-500"
    return "text-green-500"
  }

  const getProbabilityLabel = (probability: number) => {
    if (probability > 70) return "Alta probabilidad de IA"
    if (probability > 40) return "Probabilidad mixta"
    return "Probablemente humano"
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <Panel>
        <FieldLabel htmlFor="input-text">Texto a analizar</FieldLabel>
        <textarea
          id="input-text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe o pega el texto que quieres analizar..."
          className={textAreaClass()}
          rows={8}
          minLength={50}
        />

        <div className="mt-4 flex gap-2">
          <ActionButton onClick={analyzeText} disabled={inputText.length < 50 || isAnalyzing || isCooldown}>
            {isAnalyzing ? (
              <>
                <Search className="size-4 animate-spin" /> Analizando…
              </>
            ) : isCooldown ? (
              <>
                <Search className="size-4" /> Espera 5s…
              </>
            ) : (
              <>
                <BrainCircuit className="size-4" /> Analizar texto
              </>
            )}
          </ActionButton>
          <button
            onClick={() => {
              setInputText("")
              setResult(null)
              setError(null)
              setIsCooldown(false)
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Limpiar
          </button>
        </div>

        {inputText.length > 0 && inputText.length < 50 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Mínimo 50 caracteres requeridos para análisis preciso ({inputText.length}/50)
          </p>
        )}
      </Panel>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {result && (
        <Panel>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Resultados del análisis</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Bot className={`size-8 ${getProbabilityColor(result.aiProbability)}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Probabilidad IA</p>
                    <p className={`text-2xl font-bold ${getProbabilityColor(result.aiProbability)}`}>
                      {result.aiProbability}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{getProbabilityLabel(result.aiProbability)}</p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className={`size-8 ${getProbabilityColor(result.humanProbability)}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Probabilidad Humano</p>
                    <p className={`text-2xl font-bold ${getProbabilityColor(result.humanProbability)}`}>
                      {result.humanProbability}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{getProbabilityLabel(result.humanProbability)}</p>
              </div>
            </div>

            {result.analysis.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="size-4 text-muted-foreground" />
                  Análisis de la IA
                </h4>
                <ul className="space-y-2">
                  {result.analysis.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Panel>
      )}

      <p className="text-xs text-muted-foreground">
        El análisis se realiza usando Google AI (Gemini 3.5 Flash Lite). Hay un límite de 5 segundos entre peticiones para no saturar la API.
      </p>
    </div>
  )
}
