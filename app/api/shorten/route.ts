import { NextResponse } from "next/server"

export async function POST(request: Request) {
  let body: { url?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const raw = body.url?.trim()
  if (!raw) {
    return NextResponse.json({ error: "Falta la URL" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return NextResponse.json({ error: "URL no válida" }, { status: 400 })
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Solo se permiten URLs http/https" }, { status: 400 })
  }

  try {
    // Try TinyURL first (more reliable)
    const tinyurlApi = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(parsed.toString())}`
    const res = await fetch(tinyurlApi, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    })
    
    if (res.ok) {
      const shortUrl = await res.text()
      if (shortUrl && shortUrl.startsWith("http")) {
        return NextResponse.json({ shortUrl })
      }
    }
    
    // Fallback to is.gd
    const isGdApi = `https://is.gd/create.php?format=json&url=${encodeURIComponent(parsed.toString())}`
    const isGdRes = await fetch(isGdApi, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    })
    
    if (!isGdRes.ok) {
      throw new Error(`HTTP ${isGdRes.status}`)
    }
    
    const data = (await isGdRes.json()) as { shorturl?: string; errorcode?: number; errormessage?: string }

    if (data.shorturl) {
      return NextResponse.json({ shortUrl: data.shorturl })
    }

    return NextResponse.json(
      { error: data.errormessage ?? "El servicio de acortado rechazó la URL" },
      { status: 502 },
    )
  } catch (error) {
    console.error("Error acortando URL:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "No se pudo contactar al servicio de acortado" 
    }, { status: 502 })
  }
}
