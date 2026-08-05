"use client"

import { useState } from "react"
import { Upload, FileText, Image as ImageIcon, AlertTriangle, CheckCircle2, Calculator, ArrowRight, Loader2 } from "lucide-react"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

interface ReceiptItem {
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface AnalysisResult {
  items: ReceiptItem[]
  calculatedTotal: number
  receiptTotal: number
  discrepancy: number
  isOvercharged: boolean
  summary: string
}

export function ReceiptAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(selectedFile.type)) {
      setError("Solo se permiten archivos PDF o imágenes (JPG, PNG)")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("El archivo no puede exceder 10MB")
      return
    }

    setFile(selectedFile)
    setError(null)

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const analyzeReceipt = async () => {
    if (!file) return

    setAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/receipt/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error al analizar el recibo')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el recibo')
    } finally {
      setAnalyzing(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Upload className="size-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Sube tu recibo o factura</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Soporta PDF, JPG y PNG. Máximo 10MB.
            </p>
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            id="receipt-upload"
          />
          <label
            htmlFor="receipt-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            {file ? (
              <>
                {file.type.startsWith('image/') && preview ? (
                  <img src={preview} alt={`Vista previa de ${file.name}`} className="max-h-48 rounded-lg" />
                ) : (
                  <FileText className="size-12 text-muted-foreground" />
                )}
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <Upload className="size-12 text-muted-foreground" />
                <p className="text-sm font-medium">Haz clic o arrastra el archivo aquí</p>
                <p className="text-xs text-muted-foreground">PDF, JPG o PNG (máx. 10MB)</p>
              </>
            )}
          </label>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 mt-4">
            <AlertTriangle className="size-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {file && (
          <div className="flex gap-3 mt-4">
            <ActionButton onClick={analyzeReceipt} disabled={analyzing} className="flex-1">
              {analyzing ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Analizando...
                </>
              ) : (
                <>
                  Analizar recibo <ArrowRight className="size-4 ml-2" />
                </>
              )}
            </ActionButton>
            <ActionButton onClick={reset} variant="outline">
              Cancelar
            </ActionButton>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Summary Card */}
          <div className={`rounded-xl border p-6 ${
            result.isOvercharged 
              ? 'border-destructive bg-destructive/10' 
              : 'border-green-500 bg-green-500/10'
          }`}>
            <div className="flex items-start gap-3">
              {result.isOvercharged ? (
                <AlertTriangle className="size-5 text-destructive mt-0.5" />
              ) : (
                <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
              )}
              <div>
                <h3 className={`font-semibold ${result.isOvercharged ? 'text-destructive' : 'text-green-700'}`}>
                  {result.isOvercharged ? '¡Posible cobro excesivo detectado!' : 'El recibo parece correcto'}
                </h3>
                <p className="text-sm mt-1">{result.summary}</p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Comparación de totales</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Total calculado (suma de items)</span>
                <span className="font-semibold">${result.calculatedTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Total del recibo</span>
                <span className="font-semibold">${result.receiptTotal.toFixed(2)}</span>
              </div>

              <div className={`flex justify-between items-center p-4 rounded-lg ${
                result.discrepancy !== 0 
                  ? result.discrepancy > 0 
                    ? 'bg-destructive/10' 
                    : 'bg-green-500/10'
                  : 'bg-primary/10'
              }`}>
                <span className={`font-medium ${
                  result.discrepancy !== 0 
                    ? result.discrepancy > 0 
                      ? 'text-destructive' 
                      : 'text-green-700'
                    : 'text-primary'
                }`}>
                  Diferencia
                </span>
                <span className={`font-bold ${
                  result.discrepancy !== 0 
                    ? result.discrepancy > 0 
                      ? 'text-destructive' 
                      : 'text-green-700'
                    : 'text-primary'
                }`}>
                  {result.discrepancy > 0 ? '+' : ''}${result.discrepancy.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Items detectados</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Item</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Cantidad</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Precio unit.</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold">${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ActionButton onClick={reset} className="w-full">
            Analizar otro recibo
          </ActionButton>
        </>
      )}
    </div>
  )
}
