"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { FieldLabel, Panel, inputClass, textAreaClass } from "@/components/tools/ui"

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
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel className="flex flex-col gap-4">
        <div>
          <FieldLabel htmlFor="wa-phone">Phone (country code + number)</FieldLabel>
          <input
            id="wa-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="5215512345678"
            className={inputClass()}
          />
          <p className="mt-1 text-xs text-muted-foreground">Sin +, espacios ni guiones. Ej: 57 para Colombia + número.</p>
        </div>
        <div>
          <FieldLabel htmlFor="wa-msg">Mensaje predefinido (opcional)</FieldLabel>
          <textarea
            id="wa-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={textAreaClass("min-h-[100px]")}
            placeholder="Hola, me interesa…"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={prefilled}
            onChange={(e) => setPrefilled(e.target.checked)}
            className="size-4 rounded border-border"
          />
          Incluir mensaje en el enlace
        </label>
      </Panel>

      <Panel className="flex flex-col gap-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel>Enlace wa.me (recomendado)</FieldLabel>
            <CopyButton value={link} />
          </div>
          <pre className="min-h-[72px] whitespace-pre-wrap break-all rounded-xl border border-border bg-background p-3 font-mono text-sm">
            {link || "Completa el teléfono…"}
          </pre>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              Abrir en WhatsApp
            </a>
          )}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel>Enlace api.whatsapp.com</FieldLabel>
            <CopyButton value={apiLink} />
          </div>
          <pre className="min-h-[72px] whitespace-pre-wrap break-all rounded-xl border border-border bg-background p-3 font-mono text-xs">
            {apiLink || "—"}
          </pre>
        </div>
      </Panel>
    </div>
  )
}
