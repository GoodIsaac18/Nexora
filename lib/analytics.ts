import { supabase } from "@/lib/supabase"

export async function trackToolView(slug: string) {
  try {
    const supabaseAdmin = supabase
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('tools_analytics')
      .select('views')
      .eq('slug', slug)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking existing tool view:', selectError)
      return
    }

    const { error } = existing
      ? await supabaseAdmin
        .from('tools_analytics')
        .update({ 
          views: existing.views + 1,
          last_viewed: new Date().toISOString()
        })
        .eq('slug', slug)
      : await supabaseAdmin
      .from('tools_analytics')
      .insert({
        slug,
        views: 1,
        last_viewed: new Date().toISOString()
      })

    if (error) {
      console.error('Error tracking tool view:', error)
      return
    }
  } catch (e) {
    console.error('Error tracking tool view:', e)
  }
}

export async function trackToolLike(slug: string) {
  try {
    const supabaseAdmin = supabase
    const { data: existing } = await supabaseAdmin
      .from('tools_analytics')
      .select('likes')
      .eq('slug', slug)
      .single()

    if (existing) {
      await supabaseAdmin
        .from('tools_analytics')
        .update({ likes: existing.likes + 1 })
        .eq('slug', slug)
    } else {
      await supabaseAdmin
        .from('tools_analytics')
        .insert({
          slug,
          views: 0,
          likes: 1,
          last_viewed: new Date().toISOString()
        })
    }
  } catch (e) {
    console.error('Error tracking tool like:', e)
  }
}

export async function getAnalytics(): Promise<Record<string, { slug: string; views: number; likes: number; lastViewed: string }>> {
  try {
    const supabaseAdmin = supabase
    const { data, error } = await supabaseAdmin
      .from('tools_analytics')
      .select('*')

    if (error) {
      console.error('Error getting analytics:', error)
      return {}
    }

    return (data || []).reduce((acc, item: any) => {
      acc[item.slug] = {
        slug: item.slug,
        views: item.views,
        likes: item.likes,
        lastViewed: item.last_viewed
      }
      return acc
    }, {} as Record<string, { slug: string; views: number; likes: number; lastViewed: string }>)
  } catch (e) {
    console.error('Error getting analytics:', e)
    return {}
  }
}

export async function getMostViewedTools(limit = 5) {
  try {
    const supabaseAdmin = supabase
    const { data, error } = await supabaseAdmin
      .from('tools_analytics')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting most viewed tools:', error)
      return []
    }

    return data || []
  } catch (e) {
    console.error('Error getting most viewed tools:', e)
    return []
  }
}

export async function getMostLikedTools(limit = 5) {
  try {
    const supabaseAdmin = supabase
    const { data, error } = await supabaseAdmin
      .from('tools_analytics')
      .select('*')
      .order('views', { ascending: false }) // Get all first to calculate ratio

    if (error) {
      console.error('Error getting most liked tools:', error)
      return []
    }

    const result = (data || [])
      .map((t: any) => ({ ...t, likeRatio: t.views > 0 ? t.likes / t.views : 0 }))
      .sort((a: any, b: any) => b.likeRatio - a.likeRatio)
      .slice(0, limit)

    return result
  } catch (e) {
    console.error('Error getting most liked tools:', e)
    return []
  }
}

export async function getLeastViewedTools(limit = 5) {
  try {
    const supabaseAdmin = supabase
    const { data, error } = await supabaseAdmin
      .from('tools_analytics')
      .select('*')
      .gt('views', 0)
      .order('views', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error getting least viewed tools:', error)
      return []
    }

    return data || []
  } catch (e) {
    console.error('Error getting least viewed tools:', e)
    return []
  }
}
