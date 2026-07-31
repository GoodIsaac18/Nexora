"use client"

import { useState } from "react"
import { Copy, Globe, Check } from "lucide-react"
import { FieldLabel, inputClass } from "@/components/tools/ui"
import { CopyButton } from "@/components/copy-button"

export function SlugGenerator() {
  const [input, setInput] = useState("")
  const [slug, setSlug] = useState("")
  const [separator, setSeparator] = useState<"-" | "_">("-")
  const [lowercase, setLowercase] = useState(true)
  const [removeStopWords, setRemoveStopWords] = useState(false)

  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "un", "una", "el", "la", "los", "las", "y", "o", "pero", "en", "de", "para", "con", "por"
  ])

  function generateSlug() {
    if (!input.trim()) {
      setSlug("")
      return
    }

    let result = input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove special characters except spaces, hyphens, underscores
      .trim()
      .replace(/\s+/g, separator) // Replace spaces with separator
      .replace(/-+/g, separator) // Replace multiple hyphens with single
      .replace(/_+/g, separator) // Replace multiple underscores with single

    if (lowercase) {
      result = result.toLowerCase()
    }

    if (removeStopWords) {
      result = result
        .split(separator)
        .filter(word => !stopWords.has(word.toLowerCase()))
        .join(separator)
    }

    setSlug(result)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
    generateSlug()
  }

  function copySlug() {
    if (slug) {
      navigator.clipboard.writeText(slug)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <FieldLabel htmlFor="slug-input">Texto o título</FieldLabel>
        <input
          id="slug-input"
          value={input}
          onChange={handleInputChange}
          placeholder="Ej: Mi Primer Artículo de Blog"
          className={inputClass()}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Escribe cualquier texto y se generará automáticamente un slug amigable para URLs.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="separator">Separador</FieldLabel>
            <select
              id="separator"
              value={separator}
              onChange={(e) => setSeparator(e.target.value as "-" | "_")}
              className={inputClass()}
            >
              <option value="-">Guion (-)</option>
              <option value="_">Guion bajo (_)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="lowercase"
              checked={lowercase}
              onChange={(e) => {
                setLowercase(e.target.checked)
                generateSlug()
              }}
              className="h-4 w-4"
            />
            <label htmlFor="lowercase" className="text-sm">Minúsculas</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="stopwords"
              checked={removeStopWords}
              onChange={(e) => {
                setRemoveStopWords(e.target.checked)
                generateSlug()
              }}
              className="h-4 w-4"
            />
            <label htmlFor="stopwords" className="text-sm">Remover palabras vacías</label>
          </div>
        </div>

        {slug && (
          <div>
            <FieldLabel htmlFor="slug-output">Slug generado</FieldLabel>
            <div className="flex gap-2">
              <input
                id="slug-output"
                value={slug}
                readOnly
                className={inputClass()}
              />
              <CopyButton value={slug} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Longitud: {slug.length} caracteres
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
