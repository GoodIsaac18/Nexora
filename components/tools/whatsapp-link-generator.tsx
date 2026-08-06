"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel } from "@/components/tools/ui"

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "")
}

export function WhatsappLinkGenerator() {
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [prefilled, setPrefilled] = useState(true)

  const link = useMemo(() => {
    const digits = normalizePhone(phone)
    if (!digits) return ""
    const base = `https://wa.me/${digits}`
    if (!prefilled || !message.trim()) return base
    return `${base}?text=${encodeURIComponent(message)}`
  }, [phone, message, prefilled])

  const apiLink = useMemo(() => {
    const digits = normalizePhone(phone)
    if (!digits) return ""
    const base = `https://api.whatsapp.com/send?phone=${digits}`
    if (!prefilled || !message.trim()) return base
    return `${base}&text=${encodeURIComponent(message)}`
  }, [phone, message, prefilled])

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
        <div>
          <FieldLabel htmlFor="wa-phone">Phone (country code + number)</FieldLabel>
          <input
            id="wa-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="5215512345678"
            className="rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Sin +, espacios ni guiones. Ej: 57 para Colombia + número.</p>
        </div>
        <div>
          <FieldLabel htmlFor="wa-msg">Mensaje predefinido (opcional)</FieldLabel>
          <textarea
            id="wa-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[80px] sm:min-h-[100px]"
            placeholder="Hola, me interesa…"
          />
          <label className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm">
            <input
              type="checkbox"
              checked={prefilled}
              onChange={(e) => setPrefilled(e.target.checked)}
              className="size-3 sm:size-4 rounded border-border"
            />
            Incluir mensaje en el enlace
          </label>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
        <div className="mb-1 sm:mb-2 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium">wa.me link</span>
          <CopyButton value={link} />
        </div>
        <pre className="scroll-thin min-h-[80px] sm:min-h-[100px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-background p-2 sm:p-3 font-mono text-[10px] sm:text-xs">
          {link || <span className="text-muted-foreground">—</span>}
        </pre>
        <div className="mb-1 sm:mb-2 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium">api.whatsapp.com link</span>
          <CopyButton value={apiLink} />
        </div>
        <pre className="scroll-thin min-h-[80px] sm:min-h-[100px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-background p-2 sm:p-3 font-mono text-[10px] sm:text-xs">
          {apiLink || <span className="text-muted-foreground">—</span>}
        </pre>
      </div>
    </div>
  )
}
