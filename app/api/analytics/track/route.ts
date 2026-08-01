import { NextResponse } from "next/server"

// En producción, esto debería guardar en una base de datos real
// Por ahora usamos un sistema simple en memoria para demostración
const analyticsData = new Map<string, { views: number; likes: number; lastViewed: string }>()

export async function POST(request: Request) {
  try {
    const { slug, action } = await request.json()

    if (!slug || !action) {
      return NextResponse.json({ error: "Slug and action are required" }, { status: 400 })
    }

    const data = analyticsData.get(slug) || { views: 0, likes: 0, lastViewed: "" }

    if (action === "view") {
      data.views += 1
      data.lastViewed = new Date().toISOString()
    } else if (action === "like") {
      data.likes += 1
    }

    analyticsData.set(slug, data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ error: "Error tracking analytics" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"
    const limit = parseInt(searchParams.get("limit") || "10")

    const allData = Array.from(analyticsData.entries()).map(([slug, data]) => ({
      slug,
      ...data
    }))

    let result

    if (type === "most-viewed") {
      result = allData.sort((a, b) => b.views - a.views).slice(0, limit)
    } else if (type === "most-liked") {
      result = allData
        .map(t => ({ ...t, likeRatio: t.views > 0 ? t.likes / t.views : 0 }))
        .sort((a, b) => b.likeRatio - a.likeRatio)
        .slice(0, limit)
    } else if (type === "least-viewed") {
      result = allData.filter(t => t.views > 0).sort((a, b) => a.views - b.views).slice(0, limit)
    } else {
      result = allData
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error getting analytics:", error)
    return NextResponse.json({ error: "Error getting analytics" }, { status: 500 })
  }
}
