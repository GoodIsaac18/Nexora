"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, HelpCircle, ExternalLink, Search, Info, Shield } from "lucide-react"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

interface VerificationResult {
  status: "verified" | "partial" | "fake" | "unknown"
  confidence: number
  sources: string[]
  explanation: string
  context: string
}

export function FakeNewsDetector() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verify = async () => {
    if (!input.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/fact-check/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      })

      if (!response.ok) {
        throw new Error("Error al verificar la información")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setInput("")
    setResult(null)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="size-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Detector de Información</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Verifica si una noticia o información es confiable
            </p>
          </div>
        </div>

        <div className="mb-4">
          <FieldLabel htmlFor="query">Enlace o titular</FieldLabel>
          <textarea
            id="query"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pega un enlace de noticia o escribe el titular..."
            className="w-full mt-2 rounded-xl border border-border bg-background px-4 py-3 min-h-[100px] resize-none"
          />
        </div>

        <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 mb-4">
          <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            Esta herramienta usa Google Fact Check Tools API para verificar información. Si no hay API key configurada, proporcionará recursos educativos para verificación manual.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 mb-4">
            <AlertTriangle className="size-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <ActionButton onClick={verify} disabled={!input || loading} className="w-full">
          {loading ? (
            <>
              <Search className="size-4 animate-spin mr-2" />
              Verificando...
            </>
          ) : (
            <>
              <Search className="size-4 mr-2" />
              Verificar Información
            </>
          )}
        </ActionButton>
      </div>

      {result && (
        <div className={`rounded-xl border p-6 ${
          result.status === "verified" 
            ? "border-green-500 bg-green-500/10" 
            : result.status === "fake"
            ? "border-destructive bg-destructive/10"
            : result.status === "partial"
            ? "border-yellow-500 bg-yellow-500/10"
            : "border-border bg-card"
        }`}>
          <div className="flex items-start gap-3 mb-6">
            {result.status === "verified" && <CheckCircle2 className="size-6 text-green-600" />}
            {result.status === "fake" && <AlertTriangle className="size-6 text-destructive" />}
            {result.status === "partial" && <HelpCircle className="size-6 text-yellow-600" />}
            {result.status === "unknown" && <HelpCircle className="size-6 text-muted-foreground" />}
            
            <div>
              <h3 className={`font-semibold text-lg ${
                result.status === "verified" 
                  ? "text-green-700" 
                  : result.status === "fake"
                  ? "text-destructive"
                  : result.status === "partial"
                  ? "text-yellow-700"
                  : ""
              }`}>
                {result.status === "verified" && "Información Verificada ✓"}
                {result.status === "fake" && "Posible Información Falsa ⚠️"}
                {result.status === "partial" && "Información Parcial ⚠️"}
                {result.status === "unknown" && "No se pudo verificar ❓"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Confianza: {result.confidence}%
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Explicación</h4>
              <p className="text-sm text-muted-foreground">{result.explanation}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Contexto</h4>
              <p className="text-sm text-muted-foreground">{result.context}</p>
            </div>

            {result.sources.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Fuentes de verificación</h4>
                <ul className="space-y-2">
                  {result.sources.map((source, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <ExternalLink className="size-3 text-muted-foreground" />
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {source}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <ActionButton onClick={reset} variant="outline" className="w-full mt-6">
            Verificar otra información
          </ActionButton>
        </div>
      )}

      {/* Educational Resources */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="size-5 text-primary" />
          <h3 className="text-lg font-semibold">Recursos para Verificación Manual</h3>
        </div>

        <div className="space-y-3">
          <a
            href="https://www.snopes.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium">Snopes</span>
            <ExternalLink className="size-4 text-muted-foreground" />
          </a>

          <a
            href="https://www.politifact.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium">PolitiFact</span>
            <ExternalLink className="size-4 text-muted-foreground" />
          </a>

          <a
            href="https://www.factcheck.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium">FactCheck.org</span>
            <ExternalLink className="size-4 text-muted-foreground" />
          </a>

          <a
            href="https://www.google.com/search?q=fact+check"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium">Google Fact Check</span>
            <ExternalLink className="size-4 text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  )
}
