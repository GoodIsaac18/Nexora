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
      // pdf-lib doesn't support password-protected PDFs directly
      // For password removal, you would need a library like qpdf or ghostscript
      // This is a limitation of pdf-lib
      return NextResponse.json(
        { error: "pdf-lib no soporta PDFs protegidos con contraseña. Para desbloquear PDFs se requiere ghostscript o qpdf instalado en el servidor." },
        { status: 501 }
      )
    } catch (e) {
      return NextResponse.json(
        { error: "No se pudo desbloquear el PDF." },
        { status: 400 }
      )
    }

  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar el desbloqueo"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
