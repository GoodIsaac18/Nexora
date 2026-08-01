"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <AlertCircle className="size-24 text-destructive" />
            <div className="absolute inset-0 animate-ping rounded-full bg-destructive/20" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Algo salió mal
        </h2>
        <p className="mb-6 text-muted-foreground">
          Ha ocurrido un error inesperado. No te preocupes, no es tu culpa.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-destructive">Error details:</p>
            <p className="text-xs font-mono text-destructive/80">{error.message}</p>
            {error.digest && (
              <p className="mt-2 text-xs font-mono text-muted-foreground">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            <RefreshCw className="size-4" />
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 font-medium transition-all hover:bg-muted"
          >
            <Home className="size-4" />
            Ir al inicio
          </a>
        </div>

        {/* Additional Help */}
        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground">
            Si el problema persiste, por favor{" "}
            <a href="/" className="text-primary hover:underline">
              contáctanos
            </a>{" "}
            para que podamos ayudarte.
          </p>
        </div>
      </div>
    </div>
  )
}
