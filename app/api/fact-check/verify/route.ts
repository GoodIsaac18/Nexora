import { NextRequest, NextResponse } from "next/server"

interface VerificationResult {
  status: "verified" | "partial" | "fake" | "unknown"
  confidence: number
  sources: string[]
  explanation: string
  context: string
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_FACT_CHECK_API_KEY

    if (!apiKey) {
      // Return educational response when API key is not available
      return NextResponse.json({
        status: "unknown",
        confidence: 0,
        sources: [
          "https://www.snopes.com/",
          "https://www.politifact.com/",
          "https://www.factcheck.org/",
          "https://www.google.com/search?q=fact+check+" + encodeURIComponent(query)
        ],
        explanation: "No se pudo verificar automáticamente esta información. Para verificar manualmente, usa los recursos de fact-checking proporcionados abajo. Busca la información en múltiples fuentes confiables y verifica la fecha de publicación.",
        context: "La verificación de hechos requiere acceso a bases de datos especializadas. Sin una API key configurada, esta herramienta proporciona recursos educativos para ayudarte a verificar la información manualmente."
      } as VerificationResult)
    }

    // Use Google Fact Check Tools API
    const searchUrl = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${apiKey}`
    
    const response = await fetch(searchUrl)
    
    if (!response.ok) {
      console.error("Fact Check API error:", await response.text())
      return NextResponse.json({
        status: "unknown",
        confidence: 0,
        sources: [
          "https://www.snopes.com/",
          "https://www.politifact.com/",
          "https://www.factcheck.org/"
        ],
        explanation: "Error al conectar con el servicio de verificación. Por favor verifica la información manualmente usando los recursos proporcionados.",
        context: "El servicio de verificación no está disponible temporalmente. Usa los recursos de fact-checking manual para verificar la información."
      } as VerificationResult)
    }

    const data = await response.json()
    
    if (!data.claims || data.claims.length === 0) {
      return NextResponse.json({
        status: "unknown",
        confidence: 0,
        sources: [
          "https://www.snopes.com/",
          "https://www.politifact.com/",
          "https://www.factcheck.org/"
        ],
        explanation: "No se encontraron verificaciones específicas para esta consulta. Esto no significa que la información sea falsa, simplemente no ha sido verificada por las bases de datos disponibles.",
        context: "La ausencia de verificación no confirma ni desmiente la información. Siempre verifica con múltiples fuentes antes de compartir."
      } as VerificationResult)
    }

    // Analyze the claims
    const claim = data.claims[0]
    const claimReview = claim.claimReview?.[0]
    
    if (!claimReview) {
      return NextResponse.json({
        status: "unknown",
        confidence: 0,
        sources: [
          "https://www.snopes.com/",
          "https://www.politifact.com/"
        ],
        explanation: "Se encontró información relacionada pero sin verificación oficial. Verifica manualmente con las fuentes proporcionadas.",
        context: "La información existe pero no ha sido verificada por organizaciones de fact-checking."
      } as VerificationResult)
    }

    const textualRating = claimReview.textualRating?.toLowerCase() || ""
    const url = claimReview.url || ""

    // Determine status based on rating
    let status: "verified" | "partial" | "fake" | "unknown" = "unknown"
    let confidence = 50

    if (textualRating.includes("true") || textualRating.includes("correct") || textualRating.includes("accurate")) {
      status = "verified"
      confidence = 85
    } else if (textualRating.includes("false") || textualRating.includes("incorrect") || textualRating.includes("inaccurate")) {
      status = "fake"
      confidence = 85
    } else if (textualRating.includes("partial") || textualRating.includes("mixed") || textualRating.includes("half")) {
      status = "partial"
      confidence = 60
    } else if (textualRating.includes("unproven") || textualRating.includes("uncertain")) {
      status = "unknown"
      confidence = 30
    }

    return NextResponse.json({
      status,
      confidence,
      sources: url ? [url] : [],
      explanation: claimReview.textualRating || "No se pudo determinar el estado de verificación.",
      context: claim.text || "Sin contexto adicional disponible."
    } as VerificationResult)

  } catch (error) {
    console.error("Error in fact check:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
