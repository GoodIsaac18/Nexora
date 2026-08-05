import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const level = formData.get("level") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true })
    
    // Optimizaciones básicas disponibles en pdf-lib
    // Estas optimizaciones pueden reducir el tamaño en algunos casos
    const useObjectStreams = level === "medium" || level === "high"
    
    // Eliminar metadatos innecesarios
    pdfDoc.setTitle(pdfDoc.getTitle() || "Compressed")
    pdfDoc.setProducer("Anubis AI PDF Compressor")
    pdfDoc.setCreator("Anubis AI")
    
    // Guardar con optimizaciones
    const pdfBytes = await pdfDoc.save({
      useObjectStreams,
      addDefaultPage: false,
      objectsPerTick: 50,
    })
    
    const originalSize = bytes.byteLength
    const compressedSize = pdfBytes.byteLength
    
    // Calcular reducción
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    
    // Verificar si hubo alguna reducción
    if (compressedSize >= originalSize) {
      // Si no se pudo comprimir, devolver el mismo archivo pero informar
      return new NextResponse(Buffer.from(bytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=compressed.pdf",
          "X-Original-Size": originalSize.toString(),
          "X-Compressed-Size": originalSize.toString(),
          "X-Compression-Ratio": "0",
          "X-Compression-Note": "¡Este PDF ya está comprimido! No se pudo reducir más el tamaño.",
        },
      })
    }
    
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=compressed.pdf",
        "X-Original-Size": originalSize.toString(),
        "X-Compressed-Size": compressedSize.toString(),
        "X-Compression-Ratio": reduction,
      },
    })

  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar la compresión"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
