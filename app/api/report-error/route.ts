import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Input validation to prevent injection
function validateSlug(slug: string): boolean {
  const validPattern = /^[a-z0-9-_]+$/i
  return validPattern.test(slug) && slug.length <= 100
}

function validateErrorType(errorType: string): boolean {
  const validTypes = ["not-working", "slow", "ui-issue", "wrong-result", "other"]
  return validTypes.includes(errorType)
}

function sanitizeString(input: string, maxLength: number = 1000): string {
  // Remove potentially dangerous characters and limit length
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, maxLength)
    .trim()
}

export async function POST(request: Request) {
  try {
    const { toolSlug, errorType, description, userAgent } = await request.json()

    // Validate inputs
    if (!toolSlug || !errorType || !description) {
      return NextResponse.json({ error: "toolSlug, errorType, and description are required" }, { status: 400 })
    }

    if (!validateSlug(toolSlug)) {
      return NextResponse.json({ error: "Invalid toolSlug format" }, { status: 400 })
    }

    if (!validateErrorType(errorType)) {
      return NextResponse.json({ error: "Invalid errorType" }, { status: 400 })
    }

    const sanitizedDescription = sanitizeString(description, 2000)
    const sanitizedUserAgent = userAgent ? sanitizeString(userAgent, 500) : null

    if (sanitizedDescription.length < 10) {
      return NextResponse.json({ error: "Description must be at least 10 characters" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('error_reports')
      .insert({
        tool_slug: toolSlug,
        error_type: errorType,
        description: sanitizedDescription,
        user_agent: sanitizedUserAgent
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, report: data })
  } catch (error) {
    console.error("Error reporting issue:", error)
    const message = error instanceof Error ? error.message : "Error reporting issue"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const toolSlug = searchParams.get("toolSlug")

    if (toolSlug) {
      const { data, error } = await supabase
        .from('error_reports')
        .select('*')
        .eq('tool_slug', toolSlug)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return NextResponse.json({ reports: data || [] })
    }

    // Return all reports grouped by tool
    const { data: allReports, error } = await supabase
      .from('error_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Group by tool slug
    const grouped = allReports?.reduce((acc: Record<string, any[]>, report) => {
      if (!acc[report.tool_slug]) {
        acc[report.tool_slug] = []
      }
      acc[report.tool_slug].push(report)
      return acc
    }, {}) || {}

    const result = Object.entries(grouped).map(([slug, reports]) => ({
      toolSlug: slug,
      count: reports.length,
      reports: reports.slice(0, 10) // Last 10 reports
    }))

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error getting error reports:", error)
    const message = error instanceof Error ? error.message : "Error getting error reports"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
