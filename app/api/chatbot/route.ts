import { NextResponse } from "next/server"
import { tools } from "@/lib/tools"
import { sanitizeInput } from "@/lib/security"

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY
const GOOGLE_AI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"

let lastRequestTime = 0
const RATE_LIMIT_MS = 2000 // 2 segundos para el chatbot

// Filtrar solo herramientas disponibles
const availableTools = tools.filter(t => t.available)

// Crear contexto de todas las herramientas disponibles
const toolsContext = availableTools.map(tool => ({
  slug: tool.slug,
  name: tool.name,
  title: tool.title,
  description: tool.description,
  category: tool.category,
  keywords: tool.keywords.join(", ")
})).join("\n")

// Palabras clave prohibidas para evitar temas no relacionados
const FORBIDDEN_TOPICS = [
  "política", "religión", "sexo", "pornografía", "violencia", "drogas",
  "apuestas", "hackear", "ilegal", "crimen", "terrorismo", "racismo",
  "discriminación", "odio", "conspiración", "fake news", "desinformación"
]

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "Google AI API key not configured. Please add GOOGLE_AI_API_KEY to your .env.local file." }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Sanitizar input
    const sanitized = sanitizeInput(message)
    
    // Verificar longitud
    if (sanitized.length < 1 || sanitized.length > 500) {
      return NextResponse.json({ error: "Message must be between 1 and 500 characters" }, { status: 400 })
    }

    // Verificar temas prohibidos
    const lowerMessage = sanitized.toLowerCase()
    const hasForbiddenTopic = FORBIDDEN_TOPICS.some(topic => lowerMessage.includes(topic))
    
    if (hasForbiddenTopic) {
      return NextResponse.json({
        response: "Solo puedo ayudarte con preguntas relacionadas con las herramientas de Anubis AI. Por favor formula tu pregunta sobre las herramientas disponibles.",
        toolSuggestion: null
      })
    }

    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      const waitTime = RATE_LIMIT_MS - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    lastRequestTime = Date.now()

    const systemPrompt = `Eres un asistente inteligente de Anubis AI, una biblioteca de herramientas digitales. Tu función es entender el lenguaje natural del usuario y recomendarle la herramienta más adecuada.

HERRAMIENTAS DISPONIBLES:
${toolsContext}

INSTRUCCIONES OBLIGATORIAS:
1. Analiza el mensaje del usuario en lenguaje natural (puede ser informal, incompleto, o general)
2. Identifica la intención detrás del mensaje, no solo las palabras exactas
3. Si encuentras una herramienta que coincide con la intención, responde brevemente y SIEMPRE incluye [TOOL:slug] al final
4. Si el mensaje es general (hola, ayuda, etc.), recomienda la herramienta más popular o útil
5. Si hay ambigüedad, pregunta aclaraciones breves
6. Si no hay herramienta que coincida, sugiere la más cercana o pregunta más detalles
7. Sé conversacional y amigable, pero directo
8. El formato [TOOL:slug] es OBLIGATORIO cuando identifiques una herramienta

REGLAS DE IDENTIFICACIÓN:
- Busca coincidencias en keywords, nombre, descripción e INTENCIÓN del usuario
- "hola" → Recomienda herramienta popular (AI Chat o similar)
- "ayuda" → Pregunta qué necesita o recomienda herramienta general
- "analizar documento" → Busca herramientas de análisis
- "comprimir pdf" → [TOOL:pdf-compressor]
- "parafrasear" → [TOOL:paraphraser]
- "analizar CV" → [TOOL:ats-resume-analyzer]
- "convertir divisas" → [TOOL:currency-converter]

Ejemplos:
- Usuario: "hola" → "¡Hola! Te recomiendo usar: AI Chat. Chat con un asistente de IA para ayuda general. [TOOL:ai-chat]"
- Usuario: "ayuda" → "¡Claro! ¿Qué necesitas hacer? Puedo ayudarte con herramientas de PDF, conversión, análisis de texto y más."
- Usuario: "comprimir pdf" → "¡Perfecto! Tengo una herramienta para comprimir PDFs. [TOOL:pdf-compressor]"
- Usuario: "necesito analizar un documento" → "Tengo herramientas para analizar documentos. ¿Qué tipo de documento? PDF, CV, recibo?"
- Usuario: "parafrasear texto" → "¡Entendido! Te llevaré al parafraseador. [TOOL:paraphraser]"

Mensaje del usuario: ${sanitized}`

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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
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
    
    // Extraer sugerencia de herramienta si existe
    const toolMatch = generatedText.match(/\[TOOL:([a-z0-9-]+)\]/i)
    const toolSuggestion = toolMatch ? toolMatch[1] : null
    
    // Verificar que la herramienta sugerida existe y está disponible
    const validToolSuggestion = toolSuggestion && availableTools.some(t => t.slug === toolSuggestion) ? toolSuggestion : null
    
    // Limpiar el texto de respuesta eliminando el marcador de herramienta
    const cleanResponse = generatedText.replace(/\[TOOL:[a-z0-9-]+\]/i, "").trim()
    
    return NextResponse.json({ 
      response: cleanResponse,
      toolSuggestion: validToolSuggestion 
    })
  } catch (error) {
    console.error("Error in chatbot:", error)
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    )
  }
}
