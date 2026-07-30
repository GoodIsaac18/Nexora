import { NextResponse } from "next/server"
import { expectedPlatformFromSlug, resolveMediaUrl } from "@/lib/media-resolvers"
import { detectMediaPlatform } from "@/lib/media-platform"

export async function POST(request: Request) {
  let body: { url?: string; expectedSlug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const url = body.url?.trim()
  if (!url) {
    return NextResponse.json({ error: "Falta la URL del video" }, { status: 400 })
  }

  const expected = body.expectedSlug ? expectedPlatformFromSlug(body.expectedSlug) : null
  if (expected) {
    const detected = detectMediaPlatform(url)
    if (detected !== expected && detected !== "unknown") {
      return NextResponse.json(
        {
          error: `Este enlace parece ser de otra plataforma. Usa la herramienta correcta o pega un enlace de ${expected}.`,
        },
        { status: 400 },
      )
    }
  }

  try {
    const result = await resolveMediaUrl(url)
    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al resolver el enlace"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
