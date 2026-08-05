import type { MediaDownloadOption, MediaResolveResult, MediaPlatform } from "@/lib/media-types"
import {
  detectMediaPlatform,
  extractTweetPath,
} from "@/lib/media-platform"

async function resolveTikTok(url: string): Promise<MediaResolveResult> {
  const services = [
    {
      name: "TikWM",
      fn: async () => {
        const body = new URLSearchParams({ url, hd: "1" })
        const res = await fetch("https://www.tikwm.com/api/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          body: body.toString(),
          cache: "no-store",
        })
        const json = (await res.json()) as { code?: number; msg?: string; data?: { title?: string; cover?: string; play?: string; hdplay?: string; music?: string } }
        if (json.code === 0 && json.data) {
          const options: MediaDownloadOption[] = []
          const noWm = json.data.hdplay || json.data.play
          if (noWm) options.push({ label: json.data.hdplay ? "Video HD (sin marca de agua)" : "Video (sin marca de agua)", url: noWm, ext: "mp4", kind: "video" })
          if (json.data.music) options.push({ label: "Audio / música", url: json.data.music, ext: "mp3", kind: "audio" })
          return { options, title: json.data.title, thumbnail: json.data.cover }
        }
        return null
      }
    },
    {
      name: "LoveTik",
      fn: async () => {
        const body = new URLSearchParams({ url })
        const res = await fetch("https://lovetik.com/api/ajax/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          body: body.toString(),
          cache: "no-store",
        })
        if (!res.ok) return null
        const html = await res.text()
        const options: MediaDownloadOption[] = []
        const urlRegex = /href="(https:\/\/[^"]+\.mp4[^"]*)"/gi
        let match: RegExpExecArray | null
        const seen = new Set<string>()
        while ((match = urlRegex.exec(html)) !== null) {
          const videoUrl = match[1].replace(/&amp;/g, "&")
          if (seen.has(videoUrl)) continue
          seen.add(videoUrl)
          options.push({ label: `Video ${options.length + 1}`, url: videoUrl, ext: "mp4", kind: "video" })
        }
        if (options.length > 0) return { options, title: "TikTok video", thumbnail: undefined }
        return null
      }
    },
    {
      name: "SSSTik",
      fn: async () => {
        const body = new URLSearchParams({ url, count: "12", locale: "en" })
        const res = await fetch("https://ssstik.io/en", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          body: body.toString(),
          cache: "no-store",
        })
        if (!res.ok) return null
        const html = await res.text()
        const options: MediaDownloadOption[] = []
        const urlRegex = /href="(https:\/\/[^"]+\.mp4[^"]*)"/gi
        let match: RegExpExecArray | null
        const seen = new Set<string>()
        while ((match = urlRegex.exec(html)) !== null) {
          const videoUrl = match[1].replace(/&amp;/g, "&")
          if (seen.has(videoUrl)) continue
          seen.add(videoUrl)
          options.push({ label: `Video ${options.length + 1}`, url: videoUrl, ext: "mp4", kind: "video" })
        }
        if (options.length > 0) return { options, title: "TikTok video", thumbnail: undefined }
        return null
      }
    }
  ]

  let lastError: string | null = null
  for (const service of services) {
    try {
      const result = await service.fn()
      if (result && result.options.length > 0) {
        return {
          platform: "tiktok",
          title: result.title || "TikTok video",
          thumbnail: result.thumbnail,
          options: result.options.slice(0, 5),
          note: "Enlace sin marca de agua cuando el proveedor lo permite. Respeta derechos de autor.",
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Error desconocido"
      console.error(`Service ${service.name} failed:`, error)
    }
  }

  throw new Error(lastError || "No se pudo obtener el video de TikTok. Todos los servicios fallaron. El video puede ser privado o temporalmente no disponible.")
}

async function resolveYoutube(url: string): Promise<MediaResolveResult> {
  throw new Error("YouTube downloader no está disponible en Vercel. Usa TikTok, Instagram, Facebook o X.")
}

async function resolveX(url: string): Promise<MediaResolveResult> {
  const path = extractTweetPath(url)
  if (!path) throw new Error("URL de X / Twitter no válida.")

  const res = await fetch(`https://api.fxtwitter.com/${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("No se pudo leer el tweet.")

  const json = (await res.json()) as {
    tweet?: {
      text?: string
      author?: { name?: string }
      media?: {
        all?: { url?: string; type?: string; format?: string }[]
        videos?: { url?: string }[]
      }
    }
  }

  const tweet = json.tweet
  if (!tweet) throw new Error("Tweet no encontrado o sin medios públicos.")

  const options: MediaDownloadOption[] = []
  const seen = new Set<string>()

  for (const item of tweet.media?.all ?? []) {
    if (!item.url || seen.has(item.url)) continue
    seen.add(item.url)
    const isVideo = item.type === "video" || item.type === "animated_gif" || /\.mp4/i.test(item.url)
    options.push({
      label: isVideo ? "Video" : "Imagen",
      url: item.url,
      ext: isVideo ? "mp4" : "jpg",
      kind: isVideo ? "video" : "image",
    })
  }

  for (const v of tweet.media?.videos ?? []) {
    if (v.url && !seen.has(v.url)) {
      seen.add(v.url)
      options.push({ label: "Video", url: v.url, ext: "mp4", kind: "video" })
    }
  }

  if (options.length === 0) {
    throw new Error("Este tweet no tiene video descargable.")
  }

  return {
    platform: "x",
    title: tweet.text?.slice(0, 80) ?? tweet.author?.name ?? "X video",
    options,
  }
}

async function resolveInstagram(url: string): Promise<MediaResolveResult> {
  const body = new URLSearchParams({ q: url, t: "media", lang: "en" })
  const res = await fetch("https://v3.saveig.app/api/ajaxSearch", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
    cache: "no-store",
  })

  const json = (await res.json()) as { status?: string; data?: string; message?: string }
  if (json.status !== "ok" || !json.data) {
    throw new Error(json.message ?? "No se pudo resolver Instagram. Comprueba que el reel/post sea público.")
  }

  const html = json.data
  const options: MediaDownloadOption[] = []
  const hrefRe = /href="(https:\/\/[^"]+\.(?:mp4|jpg|jpeg|webp)[^"]*)"/gi
  let m: RegExpExecArray | null
  const seen = new Set<string>()
  while ((m = hrefRe.exec(html)) !== null) {
    const raw = m[1].replace(/&amp;/g, "&")
    if (seen.has(raw)) continue
    seen.add(raw)
    const isVideo = /\.mp4/i.test(raw)
    options.push({
      label: isVideo ? `Video ${options.filter((o) => o.kind === "video").length + 1}` : "Imagen",
      url: raw,
      ext: isVideo ? "mp4" : "jpg",
      kind: isVideo ? "video" : "image",
    })
  }

  if (options.length === 0) {
    throw new Error("No se encontraron medios en este enlace de Instagram.")
  }

  return {
    platform: "instagram",
    title: "Instagram media",
    options: options.slice(0, 10),
    note: "Solo contenido público. Los stories privados no están soportados.",
  }
}

async function resolveFacebook(url: string): Promise<MediaResolveResult> {
  const body = new URLSearchParams({ q: url, lang: "en" })
  const res = await fetch("https://v3.fdown.net/api/ajaxSearch", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
    cache: "no-store",
  })

  const json = (await res.json()) as { status?: string; data?: string; message?: string }
  if (json.status !== "ok" || !json.data) {
    throw new Error(json.message ?? "No se pudo resolver Facebook. Usa un enlace fb.watch o /watch/ público.")
  }

  const html = json.data
  const options: MediaDownloadOption[] = []
  const hrefRe = /href="(https:\/\/[^"]+\.mp4[^"]*)"/gi
  let m: RegExpExecArray | null
  const seen = new Set<string>()
  while ((m = hrefRe.exec(html)) !== null) {
    const raw = m[1].replace(/&amp;/g, "&")
    if (seen.has(raw)) continue
    seen.add(raw)
    options.push({
      label: `Calidad ${options.length + 1}`,
      url: raw,
      ext: "mp4",
      kind: "video",
    })
  }

  if (options.length === 0) {
    throw new Error(
      "No se encontró video en este enlace de Facebook.",
    )
  }

  return {
    platform: "facebook",
    title: "Facebook video",
    options: options.slice(0, 6),
  }
}

export async function resolveMediaUrl(inputUrl: string): Promise<MediaResolveResult> {
  const url = inputUrl.trim()
  if (!url) throw new Error("Pega un enlace.")

  let parsed: URL
  try {
    parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
  } catch {
    throw new Error("URL no válida.")
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Solo se permiten enlaces http/https.")
  }

  const platform = detectMediaPlatform(parsed.toString())

  switch (platform) {
    case "tiktok":
      return resolveTikTok(parsed.toString())
    case "youtube":
      return resolveYoutube(parsed.toString())
    case "x":
      return resolveX(parsed.toString())
    case "instagram":
      return resolveInstagram(parsed.toString())
    case "facebook":
      return resolveFacebook(parsed.toString())
    default:
      throw new Error(
        "Plataforma no reconocida. Usa enlaces de TikTok, YouTube, Instagram, Facebook o X.",
      )
  }
}

export function expectedPlatformFromSlug(slug: string): MediaPlatform | null {
  const map: Record<string, MediaPlatform> = {
    "tiktok-downloader": "tiktok",
    "youtube-downloader": "youtube",
    "instagram-downloader": "instagram",
    "facebook-downloader": "facebook",
    "x-video-downloader": "x",
  }
  return map[slug] ?? null
}
