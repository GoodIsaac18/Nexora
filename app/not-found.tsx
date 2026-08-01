import Link from "next/link"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        {/* 404 Number */}
        <div className="mb-8 relative">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="size-24 text-primary" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Página no encontrada
        </h2>
        <p className="mb-8 text-muted-foreground">
          Lo sentimos, no pudimos encontrar la página que buscas. Puede haber sido eliminada, renombrada o no existe.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            <Home className="size-4" />
            Ir al inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 font-medium transition-all hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Volver atrás
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground">
            Si crees que esto es un error, por favor{" "}
            <Link href="/" className="text-primary hover:underline">
              contáctanos
            </Link>{" "}
            o usa el buscador para encontrar lo que necesitas.
          </p>
        </div>
      </div>
    </div>
  )
}
