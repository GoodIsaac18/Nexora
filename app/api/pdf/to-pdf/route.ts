import { NextResponse } from "next/server"
import { PDFDocument, rgb } from "pdf-lib"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se proporcionaron archivos" }, { status: 400 })
    }

    const pdfDoc = await PDFDocument.create()

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      
      // Check if file is an image
      if (file.type.startsWith("image/")) {
        try {
          const image = await pdfDoc.embedJpg(bytes)
          const page = pdfDoc.addPage()
          const { width, height } = image.scale(1)
          
          // Scale image to fit page
          const pageWidth = page.getWidth()
          const pageHeight = page.getHeight()
          const scale = Math.min(pageWidth / width, pageHeight / height)
          const scaledWidth = width * scale
          const scaledHeight = height * scale
          
          page.drawImage(image, {
            x: (pageWidth - scaledWidth) / 2,
            y: (pageHeight - scaledHeight) / 2,
            width: scaledWidth,
            height: scaledHeight,
          })
        } catch {
          // If not JPG, try PNG
          try {
            const image = await pdfDoc.embedPng(bytes)
            const page = pdfDoc.addPage()
            const { width, height } = image.scale(1)
            
            const pageWidth = page.getWidth()
            const pageHeight = page.getHeight()
            const scale = Math.min(pageWidth / width, pageHeight / height)
            const scaledWidth = width * scale
            const scaledHeight = height * scale
            
            page.drawImage(image, {
              x: (pageWidth - scaledWidth) / 2,
              y: (pageHeight - scaledHeight) / 2,
              width: scaledWidth,
              height: scaledHeight,
            })
          } catch (e) {
            // Skip unsupported images
            console.error("Error embedding image:", e)
          }
        }
      }
    }

    const pdfBytes = await pdfDoc.save()
    
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=converted.pdf",
      },
    })

  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar la conversión"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
