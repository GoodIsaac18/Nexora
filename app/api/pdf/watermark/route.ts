import { NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string
    const opacity = formData.get("opacity") as string
    const rotation = formData.get("rotation") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(bytes)
    const pages = pdfDoc.getPages()
    const opacityValue = parseInt(opacity) / 100
    const rotationValue = parseInt(rotation)

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    for (const page of pages) {
      const { width, height } = page.getSize()

      if (type === "text") {
        const text = formData.get("text") as string || "CONFIDENTIAL"
        const fontSize = parseInt(formData.get("fontSize") as string || "48")

        // Calculate text dimensions
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        
        // Draw text multiple times across the page
        for (let x = 0; x < width + textWidth; x += textWidth + 100) {
          for (let y = 0; y < height + fontSize; y += fontSize + 100) {
            page.drawText(text, {
              x: x,
              y: y,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
              opacity: opacityValue,
              rotate: degrees(rotationValue),
            })
          }
        }
      } else if (type === "image") {
        const imageFile = formData.get("image") as File
        if (!imageFile) {
          return NextResponse.json({ error: "No se proporcionó imagen para la marca de agua" }, { status: 400 })
        }

        const imageBytes = await imageFile.arrayBuffer()
        let image

        try {
          image = await pdfDoc.embedPng(imageBytes)
        } catch {
          try {
            image = await pdfDoc.embedJpg(imageBytes)
          } catch {
            return NextResponse.json({ error: "Formato de imagen no soportado" }, { status: 400 })
          }
        }

        const imgWidth = image.scale(0.3).width
        const imgHeight = image.scale(0.3).height

        // Draw image multiple times across the page
        for (let x = 0; x < width + imgWidth; x += imgWidth + 50) {
          for (let y = 0; y < height + imgHeight; y += imgHeight + 50) {
            page.drawImage(image, {
              x: x,
              y: y,
              width: imgWidth,
              height: imgHeight,
              opacity: opacityValue,
            })
          }
        }
      }
    }

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=watermarked.pdf",
      },
    })

  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar la marca de agua"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
