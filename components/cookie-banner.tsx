"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"
import Link from "next/link"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0">
              <Cookie className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                Utilizamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. 
                Al continuar navegando, aceptas nuestro uso de cookies.
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <Link href="/privacy" className="text-primary hover:underline">
                  Política de Privacidad
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/terms" className="text-primary hover:underline">
                  Términos y Condiciones
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Aceptar
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
