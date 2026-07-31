import { NextResponse } from "next/server"
import { tools } from "@/lib/tools"
import { sanitizeInput } from "@/lib/security"

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY
const GOOGLE_AI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"

let lastRequestTime = 0
const RATE_LIMIT_MS = 2000 // 2 segundos para el chatbot

// Crear contexto de todas las herramientas
const toolsContext = tools.map(tool => ({
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
        response: "Solo puedo ayudarte con preguntas relacionadas con las herramientas de Nexora. Por favor formula tu pregunta sobre las herramientas disponibles.",
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

    const systemPrompt = `Eres un asistente EXCLUSIVO de Nexora, una biblioteca de herramientas digitales. SOLO puedes responder preguntas relacionadas con:
1. Las herramientas disponibles en Nexora
2. Cómo usar las herramientas
3. Funcionalidades del proyecto
4. Problemas técnicos con las herramientas

SI EL USUARIO PREGUNTA ALGO NO RELACIONADO CON NEXORA O SUS HERRAMIENTAS, DEBES RESPONDER:
"Lo siento, solo puedo ayudarte con preguntas relacionadas con las herramientas de Nexora. ¿Qué herramienta necesitas usar?"

HERRAMIENTAS DISPONIBLES:
${toolsContext}

INSTRUCCIONES ESTRICTAS:
1. NUNCA respondas preguntas sobre política, religión, sexo, violencia, drogas, apuestas, hacking, ilegalidad, crimen, terrorismo, racismo, discriminación, odio, conspiraciones, fake news o desinformación.
2. NUNCA proporciones información personal, médica, financiera o legal.
3. NUNCA hables sobre temas fuera del contexto de Nexora y sus herramientas.
4. Si el usuario pregunta algo no relacionado, redirige suavemente a las herramientas.
5. Responde de manera conversacional y amigable en español.
6. Si el usuario menciona una necesidad específica, recomienda la herramienta correspondiente.
7. Si encuentras una herramienta que coincide, incluye el slug en formato: [TOOL:slug]
8. Sé conciso y directo en tus respuestas.

Ejemplos de respuestas correctas:
- Usuario: "Quiero parafrasear un texto"
  Asistente: "¡Perfecto! Puedo ayudarte con eso. Tengo un parafraseador que usa IA para reescribir texto. Te llevaré a esa herramienta. [TOOL:paraphraser]"

- Usuario: "¿Qué opinas sobre la política?"
  Asistente: "Lo siento, solo puedo ayudarte con preguntas relacionadas con las herramientas de Nexora. ¿Qué herramienta necesitas usar?"

- Usuario: "Necesito analizar mi CV"
  Asistente: "Entendido. Tengo un analizador de CV ATS que evalúa tu currículum. Te llevaré a esa herramienta. [TOOL:ats-resume-analyzer]"

Ahora responde al mensaje del usuario: ${sanitized}`

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
    
    // Limpiar el texto de respuesta eliminando el marcador de herramienta
    const cleanResponse = generatedText.replace(/\[TOOL:[a-z0-9-]+\]/i, "").trim()
    
    return NextResponse.json({ 
      response: cleanResponse,
      toolSuggestion 
    })
  } catch (error) {
    console.error("Error in chatbot:", error)
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    )
  }
}
