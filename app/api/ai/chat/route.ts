import { NextResponse } from "next/server"
import { sanitizeInput } from "@/lib/security"
import { tools } from "@/lib/tools"

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY
const GOOGLE_AI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"

// Simple in-memory cache for common queries
const queryCache = new Map<string, { toolId: string; confidence: number; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Track failed searches for analytics
const failedSearches = new Map<string, { count: number; lastFailed: number }>()

// Rate limiting per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20

// Compact tool descriptions for token efficiency
const toolDescriptions = tools.map(t => ({
  id: t.slug,
  name: t.name,
  keywords: t.keywords.join(","),
  desc: t.description
})).map(t => `${t.id}:${t.name}:${t.keywords}:${t.desc}`).join("\n")

// Export function to get failed search metrics (for analytics)
export function getFailedSearchMetrics() {
  return Array.from(failedSearches.entries()).map(([query, data]) => ({
    query,
    count: data.count,
    lastFailed: data.lastFailed
  }))
}

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Sanitizar input
    const sanitized = sanitizeInput(message)
    
    // Verificar longitud
    if (sanitized.length < 1 || sanitized.length > 2000) {
      return NextResponse.json({ error: "Message must be between 1 and 2000 characters" }, { status: 400 })
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const rateLimitData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }
    
    if (now > rateLimitData.resetTime) {
      rateLimitData.count = 0
      rateLimitData.resetTime = now + RATE_LIMIT_WINDOW
    }
    
    rateLimitData.count++
    rateLimitMap.set(ip, rateLimitData)
    
    if (rateLimitData.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    // Check cache first
    const cacheKey = sanitized.toLowerCase().trim()
    const cached = queryCache.get(cacheKey)
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      const tool = tools.find(t => t.slug === cached.toolId)
      if (tool) {
        // Track successful cache hit
        return NextResponse.json({ 
          response: `Te recomiendo usar: ${tool.name}. ${tool.description}`,
          toolId: cached.toolId,
          confidence: cached.confidence,
          fromCache: true
        })
      }
    }

    // System prompt with compact tool descriptions
    const systemPrompt = `Eres un asistente que recomienda herramientas. Analiza la consulta del usuario y devuelve SOLO un JSON con esta estructura:
{"tool_id": "slug-de-la-herramienta", "confidence": 0.0-1.0}

Herramientas disponibles:
${toolDescriptions}

Si la consulta no coincide con ninguna herramienta, devuelve:
{"tool_id": null, "confidence": 0.0}

Consulta: ${sanitized}`

    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3, // Lower temperature for more consistent JSON output
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 100, // Minimal output for JSON only
          responseMimeType: "application/json", // Request JSON output
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      // Track failed search
      failedSearches.set(cacheKey, { 
        count: (failedSearches.get(cacheKey)?.count || 0) + 1, 
        lastFailed: now 
      })
      return NextResponse.json(
        { error: error.error?.message || "Error en la API de Google AI" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Parse JSON response
    let toolId: string | null = null
    let confidence = 0
    
    try {
      const parsed = JSON.parse(generatedText.trim())
      toolId = parsed.tool_id
      confidence = parsed.confidence || 0
    } catch {
      // Fallback: try to extract tool from text
      const toolMatch = tools.find(t => 
        sanitized.toLowerCase().includes(t.slug) || 
        t.keywords.some(k => sanitized.toLowerCase().includes(k))
      )
      if (toolMatch) {
        toolId = toolMatch.slug
        confidence = 0.5
      }
    }

    // Cache the result if confidence is high
    if (toolId && confidence > 0.7) {
      queryCache.set(cacheKey, { toolId, confidence, timestamp: now })
    }

    // Track failed search if no tool found
    if (!toolId) {
      failedSearches.set(cacheKey, { 
        count: (failedSearches.get(cacheKey)?.count || 0) + 1, 
        lastFailed: now 
      })
      
      // Return fallback suggestions for ambiguous queries
      const suggestions = tools.slice(0, 3).map(t => ({
        id: t.slug,
        name: t.name,
        description: t.description
      }))
      
      return NextResponse.json({ 
        response: "No estoy seguro de qué herramienta necesitas. Aquí tienes algunas opciones populares:",
        suggestions,
        toolId: null,
        confidence: 0
      })
    }

    const tool = tools.find(t => t.slug === toolId)
    if (tool) {
      // Cache successful match
      queryCache.set(cacheKey, { toolId, confidence, timestamp: now })
      
      return NextResponse.json({ 
        response: `Te recomiendo usar: ${tool.name}. ${tool.description}`,
        toolId,
        confidence,
        toolUrl: `/${toolId}`
      })
    }
    
    return NextResponse.json({ response: "Lo siento, no encontré una herramienta adecuada." })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    )
  }
}
