import { NextResponse } from "next/server"
import { fromPath } from "pdf2pic"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Save file temporarily for pdf2pic
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create a temporary file path (Windows compatible)
    const os = await import("os")
    const tempDir = os.tmpdir()
    const tempPath = `${tempDir}\\${Date.now()}-${file.name}`
    const fs = await import("fs")
    fs.writeFileSync(tempPath, buffer)
    
    try {
      const options = {
        density: 100,
        saveFilename: `temp-${Date.now()}`,
        savePath: tempDir,
        format: "jpg" as const,
        width: 2000,
        height: 2000,
      }
      
      const convert = fromPath(tempPath, options)
      const pageToConvertAsImage = 1
      
      const result = await convert(pageToConvertAsImage)
      
      // Read the converted image
      if (result.path) {
        const imageBuffer = fs.readFileSync(result.path)
        const base64 = imageBuffer.toString("base64")
        
        // Clean up temp files
        fs.unlinkSync(tempPath)
        if (fs.existsSync(result.path)) {
          fs.unlinkSync(result.path)
        }
        
        return NextResponse.json({
          success: true,
          image: `data:image/jpeg;base64,${base64}`,
          message: "Página 1 convertida exitosamente. Para convertir todas las páginas se requiere procesamiento adicional."
        })
      } else {
        throw new Error("No se generó la imagen")
      }
      
    } catch (e) {
      // Clean up on error
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
      throw e
    }

  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar la conversión"
    console.error("PDF to JPG error:", e)
    
    // pdf2pic requires ImageMagick or GraphicsMagick to be installed on the system
    return NextResponse.json({ 
      error: "pdf2pic requiere ImageMagick o GraphicsMagick instalado en el sistema. Por favor instala ImageMagick desde https://imagemagick.org/ para habilitar la conversión de PDF a JPG." 
    }, { status: 501 })
  }
}
