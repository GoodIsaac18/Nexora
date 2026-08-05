"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AlertTriangle, X, Send, CheckCircle } from "lucide-react"

interface ErrorReportButtonProps {
  toolSlug: string
  toolName: string
}

export function ErrorReportButton({ toolSlug, toolName }: ErrorReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [errorType, setErrorType] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
        className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive sm:px-4 sm:py-2 sm:text-sm"
      >
        <AlertTriangle className="size-3.5 sm:size-4" />
        <span>Reportar error</span>
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background shadow-2xl sm:rounded-3xl relative z-[10000]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="size-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-base font-semibold sm:text-lg">Reportar error</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">Ayúdanos a mejorar</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="size-8 text-green-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold">¡Gracias!</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tu reporte nos ayuda a mejorar Anubis AI
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Tool Info */}
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground sm:text-sm">Herramienta</p>
                    <p className="mt-1 text-sm font-semibold sm:text-base">{toolName}</p>
                  </div>

                  {/* Error Type */}
                  <div>
                    <label htmlFor="errorType" className="block text-sm font-medium mb-2.5">
                      Tipo de error
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "not-working", label: "No funciona" },
                        { value: "slow", label: "Es lento" },
                        { value: "ui-issue", label: "Problema visual" },
                        { value: "wrong-result", label: "Resultado incorrecto" },
                        { value: "other", label: "Otro" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setErrorType(option.value)}
                          className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all sm:text-sm ${
                            errorType === option.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background hover:border-primary/30"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2.5">
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe el problema que encontraste..."
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none sm:min-h-[140px] sm:text-base"
                      required
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm font-medium transition-all hover:bg-muted sm:py-3.5 sm:text-base"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !errorType || !description.trim()}
                      className="flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 sm:py-3.5 sm:text-base"
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
        </div>,
        document.body,
      )}
    </>
  )
}
