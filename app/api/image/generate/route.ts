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

    // Usar Free.ai API (gratuito, 6000 tokens/día sin cuenta)
    const apiKey = process.env.FREE_AI_API_KEY || "sk-free-000000000000000000000000000000000000000000000000"
    
    const response = await fetch("https://api.free.ai/v1/image/generate/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: sanitized,
        model: "sdxl",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Free.ai error:", errorData)
      throw new Error(errorData.error || "Error al generar la imagen con Free.ai")
    }

    const data = await response.json()
    console.log("Free.ai response:", data)
    
    // Free.ai devuelve la imagen en base64 o URL directa
    const imageUrl = data.image_url || data.image
    
    if (!imageUrl) {
      throw new Error("No image URL in response")
    }
    
    return NextResponse.json({ image: imageUrl })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al generar la imagen" },
      { status: 500 }
    )
  }
}
