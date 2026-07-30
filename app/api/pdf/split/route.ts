import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const mode = formData.get("mode") as string
    const range = formData.get("range") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(bytes)
    const totalPages = pdfDoc.getPageCount()
    
    let pagesToExtract: number[] = []

    if (mode === "all") {
      // Extract all pages individually
      pagesToExtract = Array.from({ length: totalPages }, (_, i) => i)
    } else if (mode === "range" && range) {
      // Parse range like "1-3, 5, 7-9"
      const parts = range.split(",").map(p => p.trim())
      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(n => parseInt(n.trim()) - 1) // Convert to 0-indexed
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              if (i >= 0 && i < totalPages) {
                pagesToExtract.push(i)
              }
            }
          }
        } else {
          const page = parseInt(part) - 1
          if (!isNaN(page) && page >= 0 && page < totalPages) {
            pagesToExtract.push(page)
          }
        }
      }
    }

    if (pagesToExtract.length === 0) {
      return NextResponse.json({ error: "No se especificaron páginas válidas" }, { status: 400 })
    }

    // Create individual PDFs for each page
    const urls: string[] = []
    
    for (const pageIndex of pagesToExtract) {
      const newPdf = await PDFDocument.create()
      const [page] = await newPdf.copyPages(pdfDoc, [pageIndex])
      newPdf.addPage(page)
      const pdfBytes = await newPdf.save()
      
      // Convert to base64 for JSON response
      const base64 = Buffer.from(pdfBytes).toString("base64")
      urls.push(`data:application/pdf;base64,${base64}`)
    }

    return NextResponse.json({ urls, count: urls.length })

  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar la división"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
