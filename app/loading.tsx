"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        {/* Loading Spinner */}
        <div className="relative">
          <Loader2 className="size-16 animate-spin text-primary" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold tracking-tight">Cargando...</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Preparando tu experiencia
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-2 animate-[progress_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
