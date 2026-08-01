// Sistema simple de analytics usando localStorage para el cliente
// En producción, esto debería conectarse a una base de datos real

interface ToolAnalytics {
  slug: string
  views: number
  likes: number
  lastViewed: string
}

const ANALYTICS_KEY = 'nexora_analytics'

export function trackToolView(slug: string) {
  if (typeof window === 'undefined') return
  
  try {
    const analytics = getAnalytics()
    const tool = analytics[slug] || { slug, views: 0, likes: 0, lastViewed: '' }
    tool.views += 1
    tool.lastViewed = new Date().toISOString()
    analytics[slug] = tool
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics))
  } catch (e) {
    console.error('Error tracking tool view:', e)
  }
}

export function trackToolLike(slug: string) {
  if (typeof window === 'undefined') return
  
  try {
    const analytics = getAnalytics()
    const tool = analytics[slug] || { slug, views: 0, likes: 0, lastViewed: '' }
    tool.likes += 1
    analytics[slug] = tool
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics))
  } catch (e) {
    console.error('Error tracking tool like:', e)
  }
}

export function getAnalytics(): Record<string, ToolAnalytics> {
  if (typeof window === 'undefined') return {}
  
  try {
    const data = localStorage.getItem(ANALYTICS_KEY)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error('Error getting analytics:', e)
    return {}
  }
}

export function getMostViewedTools(limit = 5): ToolAnalytics[] {
  const analytics = getAnalytics()
  return Object.values(analytics)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

export function getMostLikedTools(limit = 5): ToolAnalytics[] {
  const analytics = getAnalytics()
  return Object.values(analytics)
    .map(t => ({ ...t, likeRatio: t.views > 0 ? t.likes / t.views : 0 }))
    .sort((a, b) => b.likeRatio - a.likeRatio)
    .slice(0, limit)
}

export function getLeastViewedTools(limit = 5): ToolAnalytics[] {
  const analytics = getAnalytics()
  return Object.values(analytics)
    .filter(t => t.views > 0)
    .sort((a, b) => a.views - b.views)
    .slice(0, limit)
}
