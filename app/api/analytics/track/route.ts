import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Input validation to prevent injection
function validateSlug(slug: string): boolean {
  // Only allow alphanumeric, hyphens, and underscores
  const validPattern = /^[a-z0-9-_]+$/i
  return validPattern.test(slug) && slug.length <= 100
}

function validateAction(action: string): boolean {
  const validActions = ["view", "like"]
  return validActions.includes(action)
}

export async function POST(request: Request) {
  try {
    const { slug, action } = await request.json()

    // Validate inputs
    if (!slug || !action) {
      return NextResponse.json({ error: "Slug and action are required" }, { status: 400 })
    }

    if (!validateSlug(slug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 })
    }

    if (!validateAction(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (action === "view") {
      // Increment views
      const { data: existing } = await supabase
        .from('tools_analytics')
        .select('views')
        .eq('slug', slug)
        .single()

      if (existing) {
        await supabase
          .from('tools_analytics')
          .update({ 
            views: existing.views + 1,
            last_viewed: new Date().toISOString()
          })
          .eq('slug', slug)
      } else {
        await supabase
          .from('tools_analytics')
          .insert({
            slug,
            views: 1,
            likes: 0,
            last_viewed: new Date().toISOString()
          })
      }
    } else if (action === "like") {
      // Increment likes
      const { data: existing } = await supabase
        .from('tools_analytics')
        .select('likes')
        .eq('slug', slug)
        .single()

      if (existing) {
        await supabase
          .from('tools_analytics')
          .update({ likes: existing.likes + 1 })
          .eq('slug', slug)
      } else {
        await supabase
          .from('tools_analytics')
          .insert({
            slug,
            views: 0,
            likes: 1,
            last_viewed: new Date().toISOString()
          })
      }
    }

    // Get updated data
    const { data } = await supabase
      .from('tools_analytics')
      .select('*')
      .eq('slug', slug)
      .single()

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    const message = error instanceof Error ? error.message : "Error tracking analytics"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"
    const limit = parseInt(searchParams.get("limit") || "10")
    const slug = searchParams.get("slug")

    // If slug is provided, return analytics for that specific tool
    if (slug) {
      const { data, error } = await supabase
        .from('tools_analytics')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return NextResponse.json({ data: data ? [data] : [] })
    }

    let query = supabase.from('tools_analytics').select('*')

    if (type === "most-viewed") {
      query = query.order('views', { ascending: false }).limit(limit)
    } else if (type === "most-liked") {
      const { data } = await supabase.from('tools_analytics').select('*')
      if (!data) {
        return NextResponse.json({ data: [] })
      }
      const result = data
        .map(t => ({ ...t, likeRatio: t.views > 0 ? t.likes / t.views : 0 }))
        .sort((a, b) => b.likeRatio - a.likeRatio)
        .slice(0, limit)
      return NextResponse.json({ data: result })
    } else if (type === "least-viewed") {
      query = query.gt('views', 0).order('views', { ascending: true }).limit(limit)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("Error getting analytics:", error)
    return NextResponse.json({ error: "Error getting analytics" }, { status: 500 })
  }
}
