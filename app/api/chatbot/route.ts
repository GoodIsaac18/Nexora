import { NextResponse } from "next/server"
import { tools } from "@/lib/tools"

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || "AQ.Ab8RN6IHU3P9xnTByGB-8YbuK-keoIQWK88hmy3ooPmB91PWeg"
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

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      const waitTime = RATE_LIMIT_MS - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    lastRequestTime = Date.now()

    const systemPrompt = `Eres un asistente útil para Nexora, una biblioteca de herramientas digitales. Tu objetivo es ayudar a los usuarios a encontrar la herramienta adecuada para sus necesidades.

HERRAMIENTAS DISPONIBLES:
${toolsContext}

INSTRUCCIONES:
1. Analiza el mensaje del usuario y determina qué herramienta necesita.
2. Responde de manera conversacional y amigable en español.
3. Si el usuario menciona una necesidad específica (ej: parafrasear, analizar CV, convertir divisas, etc.), recomienda la herramienta correspondiente.
4. Si encuentras una herramienta que coincide con la necesidad del usuario, incluye el slug de la herramienta en tu respuesta en formato: [TOOL:slug]
5. Si no hay una herramienta específica, ofrece ayuda general o sugiere las herramientas más relevantes.
6. Sé conciso y directo en tus respuestas.

Ejemplos de respuestas:
- Usuario: "Quiero parafrasear un texto"
  Asistente: "¡Perfecto! Puedo ayudarte con eso. Tengo un parafraseador que usa IA para reescribir texto manteniendo el mismo significado. Te llevaré a esa herramienta. [TOOL:paraphraser]"

- Usuario: "Necesito analizar mi CV"
  Asistente: "Entendido. Tengo un analizador de CV ATS que evalúa tu currículum y te da sugerencias para mejorar. Te llevaré a esa herramienta. [TOOL:ats-resume-analyzer]"

- Usuario: "¿Qué herramientas tienes?"
  Asistente: "Tengo varias herramientas organizadas por categorías: conversores, generadores, diseño, texto, y más. Algunas de las más populares son: formateador JSON, generador de contraseñas, selector de colores, parafraseador, detector de IA, calculadora, traductor, convertidor de divisas y analizador de CV. ¿Qué necesitas hacer?"

Ahora responde al mensaje del usuario: ${message}`

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
