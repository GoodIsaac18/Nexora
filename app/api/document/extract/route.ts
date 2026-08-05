import { NextRequest, NextResponse } from "next/server"
import mammoth from 'mammoth'
import PDFParser from "pdf2json"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let text = ''

    if (file.type === 'application/pdf') {
      // Use pdf2json for PDF text extraction
      const pdfParser = new PDFParser()
      
      return new Promise((resolve, reject) => {
        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
          let fullText = ''
          if (pdfData.Pages) {
            pdfData.Pages.forEach((page: any) => {
              if (page.Texts) {
                page.Texts.forEach((textItem: any) => {
                  if (textItem.R) {
                    textItem.R.forEach((r: any) => {
                      fullText += r.T + ' '
                    })
                  }
                })
              }
            })
          }
          resolve(NextResponse.json({ text: fullText }))
        })
        
        pdfParser.on('pdfParser_dataError', (err: any) => {
          reject(NextResponse.json({ error: 'Error al extraer texto del PDF' }, { status: 500 }))
        })
        
        pdfParser.parseBuffer(buffer)
      })
    } else if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
      return NextResponse.json({ text })
    } else {
      return NextResponse.json({ error: 'Tipo de archivo no soportado. Solo PDF y Word (.doc, .docx)' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error extracting text:', error)
    return NextResponse.json({ error: 'Error al extraer texto del archivo' }, { status: 500 })
  }
}
