"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if locked out
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000)
      setError(`Demasiados intentos. Intenta de nuevo en ${remainingTime} segundos`)
      return
    }

    setLoading(true)
    setError("")

    // Simple password check - in production, use proper authentication
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_authenticated", "true")
      localStorage.setItem("admin_attempts", "0")
      router.push("/admin/dashboard")
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      localStorage.setItem("admin_attempts", newAttempts.toString())

      // Lock out after 5 failed attempts for 30 seconds
      if (newAttempts >= 5) {
        const lockUntil = Date.now() + 30000 // 30 seconds
        setLockoutTime(lockUntil)
        localStorage.setItem("admin_lockout", lockUntil.toString())
        setError("Demasiados intentos fallidos. Espera 30 segundos antes de intentar de nuevo.")
      } else {
        const remaining = 5 - newAttempts
        setError(`Contraseña incorrecta. ${remaining} intentos restantes.`)
      }
    }

    setLoading(false)
  }

  // Load attempts from localStorage on mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem("admin_attempts")
    const savedLockout = localStorage.getItem("admin_lockout")

    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts, 10))
    }

    if (savedLockout) {
      const lockout = parseInt(savedLockout, 10)
      if (lockout > Date.now()) {
        setLockoutTime(lockout)
      } else {
        // Lockout expired, reset
        localStorage.removeItem("admin_lockout")
        localStorage.removeItem("admin_attempts")
      }
    }
  }, [])

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <Lock className="size-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa tu contraseña para acceder al dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Acceder"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Configura NEXT_PUBLIC_ADMIN_PASSWORD en tu .env.local
          </p>
        </div>
      </div>
    </div>
  )
}
