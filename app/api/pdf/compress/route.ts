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
    const pdfDoc = await PDFDocument.load(bytes)
    
    // pdf-lib doesn't have built-in compression
    // For real compression, you'd need ghostscript
    // This is a basic version that just re-saves the PDF
    // which can sometimes reduce size slightly
    
    let compressionLevel = 0
    if (level === "low") compressionLevel = 1
    if (level === "medium") compressionLevel = 2
    if (level === "high") compressionLevel = 3
    
    // Re-save with different settings based on level
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: compressionLevel >= 2,
      addDefaultPage: false,
    })
    
    const originalSize = bytes.byteLength
    const compressedSize = pdfBytes.byteLength
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    
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
