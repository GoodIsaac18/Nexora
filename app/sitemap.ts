import type { MetadataRoute } from "next"
import { availableTools, SITE } from "@/lib/tools"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const home = {
    url: SITE.url,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 1,
  }
  const toolPages = availableTools().map((tool) => ({
    url: `${SITE.url}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
  return [home, ...toolPages]
}
