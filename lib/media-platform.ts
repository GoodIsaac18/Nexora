import type { MediaPlatform } from "@/lib/media-types"

export function detectMediaPlatform(input: string): MediaPlatform {
  const url = input.trim().toLowerCase()
  if (!url) return "unknown"
  if (/tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/.test(url)) return "tiktok"
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube"
  if (/instagram\.com|instagr\.am/.test(url)) return "instagram"
  if (/facebook\.com|fb\.watch|fb\.com/.test(url)) return "facebook"
  if (/twitter\.com|x\.com/.test(url)) return "x"
  return "unknown"
}

export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0] || null
    const v = url.searchParams.get("v")
    if (v) return v
    const embed = url.pathname.match(/\/embed\/([\w-]{11})/)
    if (embed) return embed[1]
    const shorts = url.pathname.match(/\/shorts\/([\w-]{11})/)
    if (shorts) return shorts[1]
  } catch {
    return null
  }
  return null
}

export function extractTweetId(input: string): string | null {
  const m = input.trim().match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i)
  return m?.[1] ?? null
}

export function extractTweetPath(input: string): string | null {
  const m = input.trim().match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(.+?\/status\/\d+)/i)
  return m?.[1] ?? null
}
