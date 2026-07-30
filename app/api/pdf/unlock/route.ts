import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Se requiere la contraseña del PDF" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    
    try {
      // pdf-lib doesn't directly support password-protected PDFs
      // However, we can try to load and re-save which sometimes removes simple protections
      // For full password removal, qpdf or ghostscript binary is required on the system
      
      // Try using a workaround: load the PDF and save it again
      // This may work for some types of protection
      const pdfDoc = await PDFDocument.load(bytes)
      
      // Save the PDF - this may remove some types of protection
      const pdfBytes = await pdfDoc.save()
      
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=unlocked.pdf",
        },
      })
    } catch (e) {
      return NextResponse.json(
        { error: "No se pudo desbloquear el PDF con pdf-lib. Para PDFs protegidos con contraseña, se requiere qpdf o ghostscript instalado en el sistema operativo." },
        { status: 400 }
      )
    }

  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar el desbloqueo"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
