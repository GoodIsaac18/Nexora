import { NextResponse } from "next/server"
import { sanitizeInput } from "@/lib/security"

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || "AQ.Ab8RN6IHU3P9xnTByGB-8YbuK-keoIQWK88hmy3ooPmB91PWeg"
const GOOGLE_AI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"

let lastRequestTime = 0
const RATE_LIMIT_MS = 2000 // 2 segundos

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

    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      const waitTime = RATE_LIMIT_MS - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    lastRequestTime = Date.now()

    // Construir el contexto del historial
    const historyContext = history.map((msg: { role: string; content: string }) => 
      `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`
    ).join('\n')

    const systemPrompt = `Eres un asistente de IA útil y amigable llamado Nexora. Puedes ayudar con cualquier tipo de pregunta o tarea.

INSTRUCCIONES:
1. Responde de manera conversacional y amigable en español.
2. Sé útil, informativo y conciso en tus respuestas.
3. Si no sabes la respuesta, sé honesto y sugiere cómo el usuario podría encontrar la información.
4. Puedes ayudar con una amplia variedad de temas: programación, escritura, matemáticas, explicaciones, traducciones, etc.
5. Mantén un tono profesional pero accesible.
6. Evita contenido ofensivo, discriminatorio o inapropiado.

HISTORIAL DE CONVERSACIÓN RECIENTE:
${historyContext}

Mensaje actual del usuario: ${sanitized}`

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
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
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
    
    return NextResponse.json({ response: generatedText.trim() })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    )
  }
}
