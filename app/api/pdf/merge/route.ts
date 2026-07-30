import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "Se requieren al menos 2 archivos PDF" }, { status: 400 })
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const pdfBytes = await mergedPdf.save()
    
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=merged.pdf",
      },
    })

  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar la fusión"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
