import { NextResponse } from "next/server"

const ALLOWED_HOST_SUFFIXES = [
  "tiktokcdn.com",
  "tiktokv.com",
  "muscdn.com",
  "tiktok.com",
  "googlevideo.com",
  "youtube.com",
  "ytimg.com",
  "fbcdn.net",
  "facebook.com",
  "cdninstagram.com",
  "instagram.com",
  "twimg.com",
  "video.twimg.com",
  "tikwm.com",
  "lovetik.com",
  "ssstik.io",
  "tikmate.app",
  "tiktokdownloader.com",
  "vm.tiktok.com",
  "v16m-default.akamaized.net",
  "v16m.tiktokcdn.com",
  "v19m-default.akamaized.net",
  "v19m.tiktokcdn.com",
  "v1.tiktokcdn.com",
  "v2.tiktokcdn.com",
  "v3.tiktokcdn.com",
  "v4.tiktokcdn.com",
  "v5.tiktokcdn.com",
  "v6.tiktokcdn.com",
  "v7.tiktokcdn.com",
  "v8.tiktokcdn.com",
  "v9.tiktokcdn.com",
  "v10.tiktokcdn.com",
  "v11.tiktokcdn.com",
  "v12.tiktokcdn.com",
  "v13.tiktokcdn.com",
  "v14.tiktokcdn.com",
  "v15.tiktokcdn.com",
  "v16.tiktokcdn.com",
  "v17.tiktokcdn.com",
  "v18.tiktokcdn.com",
  "v19.tiktokcdn.com",
  "v20.tiktokcdn.com",
  "v21.tiktokcdn.com",
  "v22.tiktokcdn.com",
  "v23.tiktokcdn.com",
  "v24.tiktokcdn.com",
  "v25.tiktokcdn.com",
  "v26.tiktokcdn.com",
  "v27.tiktokcdn.com",
  "v28.tiktokcdn.com",
  "v29.tiktokcdn.com",
  "v30.tiktokcdn.com",
  "v31.tiktokcdn.com",
  "v32.tiktokcdn.com",
  "v33.tiktokcdn.com",
  "v34.tiktokcdn.com",
  "v35.tiktokcdn.com",
  "v36.tiktokcdn.com",
  "v37.tiktokcdn.com",
  "v38.tiktokcdn.com",
  "v39.tiktokcdn.com",
  "v40.tiktokcdn.com",
]

function isAllowedMediaHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  // Allow any TikTok-related hosts
  if (h.includes("tiktok") || h.includes("tikwm") || h.includes("lovetik") || h.includes("ssstik") || h.includes("tikmate")) {
    return true
  }
  // Allow YouTube, Facebook, Instagram, X hosts
  return ALLOWED_HOST_SUFFIXES.some((suffix) => h === suffix || h.endsWith(`.${suffix}`))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get("url")
  if (!target) {
    return NextResponse.json({ error: "Falta url" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(target)
  } catch {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 })
  }

  if (parsed.protocol !== "https:" || !isAllowedMediaHost(parsed.hostname)) {
    return NextResponse.json({ error: "Host no permitido" }, { status: 403 })
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: parsed.origin,
      },
      redirect: "follow",
    })

    if (!upstream.ok) {
      return NextResponse.json({ error: "No se pudo descargar el archivo" }, { status: 502 })
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream"
    const buffer = await upstream.arrayBuffer()
    const filename = searchParams.get("filename") ?? "download"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename.replace(/[^\w.-]/g, "_")}"`,
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return NextResponse.json({ error: "Error de red al descargar" }, { status: 502 })
  }
}
