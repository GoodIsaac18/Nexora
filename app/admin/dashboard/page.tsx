"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Users, Heart, MessageSquare, LogOut, ChevronLeft, ChevronRight, Calendar, Activity, PieChart } from "lucide-react"
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts"
import { tools } from "@/lib/tools"

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

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#6366f1']

export default function AdminDashboard() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [errorReports, setErrorReports] = useState<ErrorReportsGrouped[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "most-viewed" | "most-liked" | "least-viewed" | "error-reports">("overview")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("all")

  useEffect(() => {
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
    let data = analytics
    switch (activeTab) {
      case "most-viewed":
        data = [...analytics].sort((a, b) => b.views - a.views)
        break
      case "most-liked":
        data = [...analytics]
          .map(t => ({ ...t, likeRatio: t.views > 0 ? t.likes / t.views : 0 }))
          .sort((a, b) => (b.likeRatio || 0) - (a.likeRatio || 0))
        break
      case "least-viewed":
        data = [...analytics].filter(t => t.views > 0).sort((a, b) => a.views - b.views)
        break
      default:
        data = analytics
    }
    return data
  }

  const paginatedData = getFilteredData().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(getFilteredData().length / itemsPerPage)

  const totalViews = analytics.reduce((sum, t) => sum + t.views, 0)
  const totalLikes = analytics.reduce((sum, t) => sum + t.likes, 0)
  const avgLikeRatio = analytics.length > 0 ? (totalLikes / totalViews) * 100 : 0
  const totalErrorReports = errorReports.reduce((sum, t) => sum + t.count, 0)

  // Datos para gráficos
  const topToolsData = [...analytics]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map(t => ({
      name: t.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      views: t.views,
      likes: t.likes
    }))

  const categoryData = tools.reduce((acc, tool) => {
    const analyticsData = analytics.find(a => a.slug === tool.slug)
    if (analyticsData) {
      acc[tool.category] = (acc[tool.category] || 0) + analyticsData.views
    }
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  }))

  const trendData = analytics.slice(0, 7).map(t => ({
    name: t.slug.substring(0, 10),
    views: t.views,
    likes: t.likes
  }))

  // Datos adicionales para nuevos gráficos
  const areaData = analytics.slice(0, 12).map(t => ({
    name: t.slug.replace(/-/g, ' ').substring(0, 8),
    views: t.views,
    likes: t.likes,
    ratio: t.views > 0 ? (t.likes / t.views) * 100 : 0
  }))

  const radarData = Object.entries(categoryData).slice(0, 6).map(([name, value]) => ({
    subject: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value,
    fullMark: Math.max(...Object.values(categoryData))
  }))

  const donutData = Object.entries(categoryData).map(([name, value]) => ({
    name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  }))

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
            <p className="mt-2 text-muted-foreground">Métricas detalladas de uso de herramientas</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Vistas</p>
                  <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                </div>
              </div>
              <TrendingUp className="size-5 text-green-500" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10">
                  <Heart className="size-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                  <p className="text-2xl font-bold">{totalLikes.toLocaleString()}</p>
                </div>
              </div>
              <TrendingUp className="size-5 text-green-500" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <AlertTriangle className="size-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reportes Error</p>
                  <p className="text-2xl font-bold">{totalErrorReports.toLocaleString()}</p>
                </div>
              </div>
              {totalErrorReports > 0 && <TrendingDown className="size-5 text-red-500" />}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Activity className="size-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ratio Likes</p>
                  <p className="text-2xl font-bold">{avgLikeRatio.toFixed(1)}%</p>
                </div>
              </div>
              <TrendingUp className="size-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border bg-card p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium mb-2 block">Rango de fecha</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="all">Todo el tiempo</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Items por página</label>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts Section - Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Top Tools Bar Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Top 10 Herramientas por Vistas</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topToolsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#3b82f6" name="Vistas" />
                <Bar dataKey="likes" fill="#ec4899" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Distribución por Categoría</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section - Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Area Chart for Cumulative Views */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Vistas Acumuladas por Herramienta</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="views" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Vistas" />
                <Area type="monotone" dataKey="likes" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} name="Likes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart for Categories */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Radar de Categorías</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} />
                <Radar name="Vistas" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section - Row 3 */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Line Chart for Trends */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Tendencias de Uso</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="Vistas" />
                <Line type="monotone" dataKey="likes" stroke="#ec4899" strokeWidth={2} name="Likes" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart for Categories */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Donut de Categorías</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
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
              onClick={() => { setActiveTab(tab.id as any); setCurrentPage(1) }}
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

        {/* Table with Pagination */}
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
          <>
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
                    {paginatedData.map((tool) => (
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

              {paginatedData.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  No hay datos disponibles
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, getFilteredData().length)} de {getFilteredData().length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
