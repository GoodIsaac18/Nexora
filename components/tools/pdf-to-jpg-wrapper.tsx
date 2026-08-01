"use client"

import dynamic from "next/dynamic"

const PdfToJpg = dynamic(() => import("./pdf-to-jpg").then(mod => ({ default: mod.PdfToJpg })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8">Cargando herramienta...</div>
})

export function PdfToJpgWrapper() {
  return <PdfToJpg />
}
