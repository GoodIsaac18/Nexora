"use client"

import { useState } from "react"
import { Briefcase, CheckCircle, AlertTriangle, XCircle, FileText, Search, Award, GraduationCap, AlertCircle } from "lucide-react"
import { ActionButton, FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"
import { secureInput } from "@/lib/security"

export function AtsResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [result, setResult] = useState<{
    score: number
    issues: { type: "error" | "warning" | "success"; message: string }[]
    suggestions: string[]
    keywords: { found: string[]; missing: string[] }
    sections: { name: string; present: boolean }[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeResume = async () => {
    if (!resumeText.trim() || isAnalyzing || isCooldown) return

    // Sanitizar inputs
    const resumeValidation = secureInput(resumeText, {
      maxLength: 15000,
      minLength: 100
    })

    if (!resumeValidation.isValid) {
      setError("El CV contiene caracteres no permitidos o excede el límite de longitud.")
      return
    }

    if (jobDescription.trim()) {
      const jobValidation = secureInput(jobDescription, {
        maxLength: 5000,
        minLength: 10
      })

      if (!jobValidation.isValid) {
        setError("La descripción del trabajo contiene caracteres no permitidos o excede el límite de longitud.")
        return
      }
    }

    setIsAnalyzing(true)
    setIsCooldown(true)
    setError(null)
    
    try {
      const jobDescPart = jobDescription.trim() ? `\n\nDescripción del trabajo:\n${jobDescription}` : ""
      const prompt = `Analiza el siguiente CV para determinar si pasará los sistemas ATS (Applicant Tracking Systems). Devuelve el resultado en formato JSON con esta estructura exacta:
{
  "score": número entre 0 y 100,
  "issues": [
    {"type": "error"|"warning"|"success", "message": "descripción"}
  ],
  "suggestions": ["lista de 3-5 sugerencias de mejora"],
  "keywords": {
    "found": ["palabras clave encontradas"],
    "missing": ["palabras clave faltantes"]
  },
  "sections": [
    {"name": "nombre de sección", "present": true|false}
  ]
}

CV a analizar:
${resumeText}${jobDescPart}`
      
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al analizar el CV")
      }

      const data = await response.json()
      
      // Parse JSON response
      const jsonMatch = data.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsedResult = JSON.parse(jsonMatch[0])
        setResult({
          score: Math.min(100, Math.max(0, parsedResult.score || 70)),
          issues: parsedResult.issues || [],
          suggestions: parsedResult.suggestions || [],
          keywords: parsedResult.keywords || { found: [], missing: [] },
          sections: parsedResult.sections || []
        })
      } else {
        throw new Error("No se pudo parsear la respuesta de la IA")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar el CV. Intenta de nuevo.")
    } finally {
      setIsAnalyzing(false)
      // Cooldown de 5 segundos para evitar saturar la API
      setTimeout(() => setIsCooldown(false), 5000)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente - Alta probabilidad de pasar ATS"
    if (score >= 60) return "Bueno - Probabilidad moderada"
    if (score >= 40) return "Regular - Necesita mejoras"
    return "Pobre - Requiere revisiones importantes"
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 sm:px-0">
      <Panel>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="size-5" />
          <h3 className="text-lg font-semibold">Analizador de CV ATS</h3>
        </div>

        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="resume-text">Contenido de tu CV</FieldLabel>
            <textarea
              id="resume-text"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Pega aquí el contenido completo de tu CV..."
              className={textAreaClass()}
              rows={8}
            />
          </div>

          <div>
            <FieldLabel htmlFor="job-description">Descripción del trabajo (opcional)</FieldLabel>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Pega aquí la descripción del trabajo para comparar palabras clave..."
              className={textAreaClass()}
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <ActionButton onClick={analyzeResume} disabled={!resumeText.trim() || isAnalyzing || isCooldown} className="w-full sm:w-auto">
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
                  <Search className="size-4" /> Analizar CV
                </>
              )}
            </ActionButton>
            <button
              onClick={() => {
                setResumeText("")
                setJobDescription("")
                setResult(null)
                setError(null)
                setIsCooldown(false)
              }}
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              Limpiar
            </button>
          </div>
        </div>
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
            
            <div className="rounded-2xl border-2 border-border bg-muted/30 p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Puntuación ATS</p>
                <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}%
                </p>
                <p className="text-sm mt-2">{getScoreLabel(result.score)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {result.sections.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    Secciones del CV
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {result.sections.map((section, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 rounded-lg p-2 text-sm ${
                          section.present ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {section.present ? (
                          <CheckCircle className="size-4" />
                        ) : (
                          <XCircle className="size-4" />
                        )}
                        {section.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="size-4 text-muted-foreground" />
                    Problemas detectados
                  </h4>
                  <div className="space-y-2">
                    {result.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
                          issue.type === "error"
                            ? "bg-red-500/10 text-red-500"
                            : issue.type === "warning"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {issue.type === "error" && <XCircle className="size-4 shrink-0 mt-0.5" />}
                        {issue.type === "warning" && <AlertTriangle className="size-4 shrink-0 mt-0.5" />}
                        {issue.type === "success" && <CheckCircle className="size-4 shrink-0 mt-0.5" />}
                        {issue.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Award className="size-4 text-muted-foreground" />
                    Sugerencias de mejora
                  </h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(result.keywords.found.length > 0 || result.keywords.missing.length > 0) && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="size-4 text-muted-foreground" />
                    Palabras clave
                  </h4>
                  <div className="space-y-2">
                    {result.keywords.found.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Encontradas:</p>
                        <div className="flex flex-wrap gap-1">
                          {result.keywords.found.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-500"
                            >
                              <CheckCircle className="size-3 mr-1" />
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.keywords.missing.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Faltantes:</p>
                        <div className="flex flex-wrap gap-1">
                          {result.keywords.missing.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-500"
                            >
                              <XCircle className="size-3 mr-1" />
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>
      )}

      <p className="text-xs text-muted-foreground">
        El análisis se realiza usando Google AI (Gemini 3.5 Flash Lite). Hay un límite de 5 segundos entre peticiones para no saturar la API.
      </p>
    </div>
  )
}
