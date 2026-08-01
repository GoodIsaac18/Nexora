import { NextResponse } from "next/server"

// En producción, esto debería guardar en una base de datos real
// Por ahora usamos un sistema simple en memoria para demostración
const errorReports = new Map<string, Array<{
  id: string
  toolSlug: string
  errorType: string
  description: string
  timestamp: string
  userAgent?: string
}>()

export async function POST(request: Request) {
  try {
    const { toolSlug, errorType, description, userAgent } = await request.json()

    if (!toolSlug || !errorType || !description) {
      return NextResponse.json({ error: "toolSlug, errorType, and description are required" }, { status: 400 })
    }

    const report = {
      id: Date.now().toString(),
      toolSlug,
      errorType,
      description,
      timestamp: new Date().toISOString(),
      userAgent
    }

    const toolReports = errorReports.get(toolSlug) || []
    toolReports.push(report)
    errorReports.set(toolSlug, toolReports)

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error("Error reporting issue:", error)
    return NextResponse.json({ error: "Error reporting issue" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const toolSlug = searchParams.get("toolSlug")

    if (toolSlug) {
      const reports = errorReports.get(toolSlug) || []
      return NextResponse.json({ reports })
    }

    // Return all reports grouped by tool
    const allReports = Array.from(errorReports.entries()).map(([slug, reports]) => ({
      toolSlug: slug,
      count: reports.length,
      reports: reports.slice(-10) // Last 10 reports
    }))

    return NextResponse.json({ data: allReports })
  } catch (error) {
    console.error("Error getting error reports:", error)
    return NextResponse.json({ error: "Error getting error reports" }, { status: 500 })
  }
}
