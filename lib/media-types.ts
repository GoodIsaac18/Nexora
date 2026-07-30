export type MediaPlatform =
  | "tiktok"
  | "youtube"
  | "instagram"
  | "facebook"
  | "x"
  | "unknown"

export type MediaDownloadOption = {
  label: string
  url: string
  ext: string
  kind: "video" | "audio" | "image"
}

export type MediaResolveResult = {
  platform: MediaPlatform
  title: string
  thumbnail?: string
  options: MediaDownloadOption[]
  note?: string
}

export type MediaResolveError = {
  error: string
}
