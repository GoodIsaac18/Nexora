"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Users, Heart, MessageSquare, LogOut } from "lucide-react"

interface AnalyticsData {
  slug: string
  views: number
  likes: number
  last_viewed: string
  likeRatio?: number
}

interface ErrorReport {
  id: string
  tool_slug: string
  error_type: string
  description: string
  user_agent: string
  created_at: string
}

interface ErrorReportsGrouped {
  toolSlug: string
  count: number
  reports: ErrorReport[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [errorReports, setErrorReports] = useState<ErrorReportsGrouped[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "most-viewed" | "most-liked" | "least-viewed" | "error-reports">("overview")

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("admin_authenticated")
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    fetchAnalytics()
    fetchErrorReports()
  }, [router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/track")
      const data = await response.json()
      setAnalytics(data.data || [])
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchErrorReports = async () => {
    try {
      const response = await fetch("/api/report-error")
      const data = await response.json()
      setErrorReports(data.data || [])
    } catch (error) {
      console.error("Error fetching error reports:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/admin")
  }

  const getFilteredData = () => {
    switch (activeTab) {
      case "most-viewed":
        return [...analytics].sort((a, b) => b.views - a.views).slice(0, 10)
      case "most-liked":
        return [...analytics]
          .map(t => ({ ...t, likeRatio: t.views > 0 ? t.likes / t.views : 0 }))
          .sort((a, b) => (b.likeRatio || 0) - (a.likeRatio || 0))
          .slice(0, 10)
      case "least-viewed":
        return [...analytics].filter(t => t.views > 0).sort((a, b) => a.views - b.views).slice(0, 10)
      default:
        return analytics
    }
  }

  const totalViews = analytics.reduce((sum, t) => sum + t.views, 0)
  const totalLikes = analytics.reduce((sum, t) => sum + t.likes, 0)
  const avgLikeRatio = analytics.length > 0 ? totalLikes / totalViews : 0
  const totalErrorReports = errorReports.reduce((sum, t) => sum + t.count, 0)

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-center">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Cargando analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Analytics</h1>
            <p className="mt-2 text-muted-foreground">Métricas de uso de herramientas</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:bg-muted"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vistas</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10">
                <Heart className="size-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Likes</p>
                <p className="text-2xl font-bold">{totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10">
                <AlertTriangle className="size-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reportes Error</p>
                <p className="text-2xl font-bold">{totalErrorReports.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10">
                <BarChart3 className="size-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Herramientas</p>
                <p className="text-2xl font-bold">{analytics.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "General" },
            { id: "most-viewed", label: "Más vistas" },
            { id: "most-liked", label: "Más liked" },
            { id: "least-viewed", label: "Menos vistas" },
            { id: "error-reports", label: "Reportes de error" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {activeTab === "error-reports" ? (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Herramienta</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Reportes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Último reporte</th>
                  </tr>
                </thead>
                <tbody>
                  {errorReports.map((group) => (
                    <tr key={group.toolSlug} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="size-4 text-muted-foreground" />
                          <span className="font-medium">{group.toolSlug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1">
                          <AlertTriangle className="size-4 text-orange-500" />
                          {group.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(group.reports[0]?.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {errorReports.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                No hay reportes de error disponibles
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Herramienta</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Vistas</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Likes</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Ratio</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Última vista</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData().map((tool) => (
                    <tr key={tool.slug} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="font-medium">{tool.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1">
                          <Users className="size-4 text-muted-foreground" />
                          {tool.views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1">
                          <Heart className="size-4 text-red-500" />
                          {tool.likes.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${tool.views > 0 ? (tool.likes / tool.views) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {tool.views > 0 ? ((tool.likes / tool.views) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        {new Date(tool.last_viewed).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {getFilteredData().length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                No hay datos disponibles
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
