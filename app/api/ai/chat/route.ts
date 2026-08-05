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
    // Check if API key is configured
    if (!GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "Google AI API key not configured. Please add GOOGLE_AI_API_KEY to your .env.local file." }, { status: 401 })
    }

    const formData = await request.formData()
    const message = formData.get("message") as string
    const historyJson = formData.get("history") as string
    const files = formData.getAll("files") as File[]

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Sanitizar input
    const sanitized = sanitizeInput(message)
    
    // Verificar longitud
    if (sanitized.length < 1 || sanitized.length > 2000) {
      return NextResponse.json({ error: "Message must be between 1 and 2000 characters" }, { status: 400 })
    }

    // Parse history
    let history = []
    try {
      if (historyJson) {
        history = JSON.parse(historyJson)
      }
    } catch {
      history = []
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

    // Process files if present
    let fileContext = ""
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
        }
        
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown']
        if (!validTypes.includes(file.type)) {
          return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })
        }
        
        // For text files, read content
        if (file.type === 'text/plain' || file.type === 'text/markdown') {
          const text = await file.text()
          fileContext += `\n\nArchivo: ${file.name}\n${text}\n`
        } else {
          // For PDF/Word, just note the file name (actual parsing would require additional libraries)
          fileContext += `\n\nArchivo adjunto: ${file.name} (${file.type})\n`
        }
      }
    }

    // Check cache first (only if no files)
    if (files.length === 0) {
      const cacheKey = sanitized.toLowerCase().trim()
      const cached = queryCache.get(cacheKey)
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        const tool = tools.find(t => t.slug === cached.toolId)
        if (tool) {
          return NextResponse.json({ 
            response: `Te recomiendo usar: ${tool.name}. ${tool.description}`,
            toolId: cached.toolId,
            confidence: cached.confidence,
            fromCache: true
          })
        }
      }
    }

    // System prompt with file context if present
    const systemPrompt = fileContext 
      ? `Eres un asistente de IA experto en análisis de documentos y comprensión de contexto. Tu objetivo es entender profundamente lo que el usuario necesita.

Contexto de archivos:${fileContext}

Consulta del usuario: ${sanitized}

INSTRUCCIONES DE ANÁLISIS DE CONTEXTO:
1. Lee y analiza TODO el contenido del documento adjunto antes de responder.
2. Identifica el tema principal, los puntos clave y el propósito del documento.
3. Considera el contexto de la pregunta del usuario dentro del documento completo.
4. Si la pregunta es ambigua o podría tener múltiples interpretaciones, HAZ PREGUNTAS CLARIFICADORAS específicas.
5. Si el usuario pregunta sobre herramientas específicas, recomienda las más adecuadas basándote en el contexto del documento.
6. Si no estás seguro de la respuesta, admítelo explícitamente y pide más información.
7. Proporciona respuestas detalladas y completas, citando partes relevantes del documento cuando sea apropiado.
8. Mantén el contexto de la conversación anterior para entender mejor las necesidades del usuario.

Historial de conversación reciente:
${history.length > 0 ? JSON.stringify(history.slice(-5)) : "Ninguno"}

Responde en español de manera clara y útil.`
      : `Eres un asistente inteligente experto en entender la intención y contexto de los usuarios para recomendar herramientas adecuadas.

INSTRUCCIONES DE ANÁLISIS DE CONTEXTO:
1. Analiza la consulta del usuario MUY cuidadosamente para entender:
   - La INTENCIÓN principal (qué quiere lograr)
   - El CONTEXTO específico (para qué lo necesita, situación particular)
   - Los DETALLES implícitos (información no explícita pero relevante)
   - El NIVEL de experiencia del usuario (técnico vs principiante)

2. Considera el HISTORIAL DE CONVERSACIÓN para mantener el contexto:
   - Si el usuario ha preguntado cosas relacionadas antes, usa esa información
   - Si está refinando una búsqueda anterior, adapta tu respuesta
   - Si es una nueva conversación, trata cada consulta de forma independiente pero con contexto

3. Si la consulta es AMBIGUA o tiene múltiples interpretaciones:
   - HAZ PREGUNTAS CLARIFICADORAS específicas y relevantes
   - No asumas una interpretación sin confirmar
   - Ofrece opciones cuando sea apropiado

4. Si la consulta no coincide claramente con ninguna herramienta:
   - Busca herramientas relacionadas por funcionalidad
   - Considera sinónimos, variaciones de lenguaje y diferentes contextos
   - Devuelve sugerencias relevantes en lugar de null

5. Evalúa la CONFIDENCE de tu recomendación:
   - > 0.8: Muy seguro de que es la herramienta correcta
   - 0.5-0.8: Moderadamente seguro, puede incluir pregunta de clarificación
   - < 0.5: Poco seguro, DEBE incluir pregunta de clarificación

Herramientas disponibles:
${toolDescriptions}

FORMATO DE RESPUESTA JSON:
{"tool_id": "slug-de-la-herramienta", "confidence": 0.0-1.0, "clarification_question": "opcional: pregunta específica para clarificar si no estás seguro"}

Consulta del usuario: ${sanitized}

Historial de conversación reciente:
${history.length > 0 ? JSON.stringify(history.slice(-5)) : "Ninguno"}`

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
          temperature: fileContext ? 0.7 : 0.3, // Higher temperature for document analysis
          topK: 20,
          topP: 0.8,
          maxOutputTokens: fileContext ? 2000 : 100, // More tokens for document analysis
          responseMimeType: fileContext ? "text/plain" : "application/json",
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.error?.message || "Error en la API de Google AI" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // If files were present, return the AI response directly
    if (fileContext) {
      return NextResponse.json({ 
        response: generatedText || "Lo siento, no pude procesar tu solicitud.",
        toolId: null,
        confidence: 0
      })
    }
    
    // Parse JSON response for tool recommendations
    let toolId: string | null = null
    let confidence = 0
    let clarificationQuestion: string | null = null
    
    try {
      const parsed = JSON.parse(generatedText.trim())
      toolId = parsed.tool_id
      confidence = parsed.confidence || 0
      clarificationQuestion = parsed.clarification_question || null
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
      const cacheKey = sanitized.toLowerCase().trim()
      queryCache.set(cacheKey, { toolId, confidence, timestamp: now })
    }

    // Track failed search if no tool found
    if (!toolId) {
      const cacheKey = sanitized.toLowerCase().trim()
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
        response: clarificationQuestion || "No estoy seguro de qué herramienta necesitas. Aquí tienes algunas opciones populares:",
        suggestions,
        toolId: null,
        confidence: 0,
        clarificationQuestion
      })
    }

    const tool = tools.find(t => t.slug === toolId)
    if (tool) {
      // If confidence is low, include clarification question
      if (confidence < 0.7 && clarificationQuestion) {
        return NextResponse.json({ 
          response: `${clarificationQuestion}\n\nBasándome en lo que entiendo, te recomiendo: ${tool.name}. ${tool.description}`,
          toolId,
          confidence,
          toolUrl: `/${toolId}`,
          clarificationQuestion
        })
      }
      
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
