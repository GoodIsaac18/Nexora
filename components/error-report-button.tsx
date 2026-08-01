"use client"

import { useState } from "react"
import { AlertTriangle, X, Send, CheckCircle } from "lucide-react"

interface ErrorReportButtonProps {
  toolSlug: string
  toolName: string
}

export function ErrorReportButton({ toolSlug, toolName }: ErrorReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [errorType, setErrorType] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!errorType || !description.trim()) return

    setIsSubmitting(true)

    try {
      await fetch("/api/report-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          errorType,
          description: description.trim(),
          userAgent: navigator.userAgent
        })
      })

      setSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false)
        setErrorType("")
        setDescription("")
      }, 2000)
    } catch (error) {
      console.error("Error submitting report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
      >
        <AlertTriangle className="size-4" />
        Reportar error
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reportar error</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle className="size-12 text-green-500" />
                <p className="text-center text-sm text-muted-foreground">
                  ¡Gracias por tu reporte! Lo revisaremos pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Herramienta
                  </label>
                  <p className="text-sm text-muted-foreground">{toolName}</p>
                </div>

                <div>
                  <label htmlFor="errorType" className="block text-sm font-medium mb-2">
                    Tipo de error
                  </label>
                  <select
                    id="errorType"
                    value={errorType}
                    onChange={(e) => setErrorType(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Selecciona un tipo...</option>
                    <option value="not-working">No funciona</option>
                    <option value="slow">Es muy lento</option>
                    <option value="ui-issue">Problema visual</option>
                    <option value="wrong-result">Resultado incorrecto</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el problema que encontraste..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !errorType || !description.trim()}
                    className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="size-4" />
                        Enviar
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
