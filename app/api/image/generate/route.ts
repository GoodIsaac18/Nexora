import { NextResponse } from "next/server"
import { sanitizeInput } from "@/lib/security"

let lastRequestTime = 0
const RATE_LIMIT_MS = 5000 // 5 segundos

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Sanitizar input
    const sanitized = sanitizeInput(prompt)
    
    // Verificar longitud
    if (sanitized.length < 10 || sanitized.length > 500) {
      return NextResponse.json({ error: "Prompt must be between 10 and 500 characters" }, { status: 400 })
    }

    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      const waitTime = RATE_LIMIT_MS - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    lastRequestTime = Date.now()

    // Usar Pollinations AI (gratuito, sin API key)
    const encodedPrompt = encodeURIComponent(sanitized)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`
    
    return NextResponse.json({ image: imageUrl })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      { error: "Error al generar la imagen" },
      { status: 500 }
    )
  }
}
