"use client"

import { useState } from "react"
import { Sparkles, Copy, RefreshCw, Languages } from "lucide-react"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

interface GeneratedName {
  name: string
  translations: Record<string, string>
}

const industries = [
  "Tecnología", "Comercio", "Restaurante", "Salud", "Educación",
  "Moda", "Finanzas", "Construcción", "Marketing", "Consultoría",
  "Arte", "Deportes", "Viajes", "Alimentos", "Servicios"
]

const suffixes = [
  "Hub", "Lab", "Pro", "Co", "Sys", "Net", "Tech", "Works",
  "Studio", "Space", "Zone", "Point", "Center", "Base", "Core"
]

const prefixes = [
  "Nova", "Ultra", "Super", "Mega", "Hyper", "Prime", "Elite",
  "Alpha", "Beta", "Delta", "Omega", "Zen", "Neo", "Flux"
]

const translations = {
  "en": "Inglés",
  "es": "Español",
  "fr": "Francés",
  "de": "Alemán",
  "pt": "Portugués",
  "it": "Italiano"
}

const nameTranslations: Record<string, Record<string, string>> = {
  "Nova": { "en": "Nova", "es": "Nova", "fr": "Nova", "de": "Nova", "pt": "Nova", "it": "Nova" },
  "Ultra": { "en": "Ultra", "es": "Ultra", "fr": "Ultra", "de": "Ultra", "pt": "Ultra", "it": "Ultra" },
  "Prime": { "en": "Prime", "es": "Prime", "fr": "Prime", "de": "Prime", "pt": "Prime", "it": "Prime" },
  "Alpha": { "en": "Alpha", "es": "Alfa", "fr": "Alpha", "de": "Alpha", "pt": "Alfa", "it": "Alpha" },
  "Omega": { "en": "Omega", "es": "Omega", "fr": "Omega", "de": "Omega", "pt": "Omega", "it": "Omega" },
  "Zen": { "en": "Zen", "es": "Zen", "fr": "Zen", "de": "Zen", "pt": "Zen", "it": "Zen" },
  "Neo": { "en": "Neo", "es": "Neo", "fr": "Neo", "de": "Neo", "pt": "Neo", "it": "Neo" },
  "Hub": { "en": "Hub", "es": "Centro", "fr": "Centre", "de": "Zentrum", "pt": "Centro", "it": "Centro" },
  Lab: { "en": "Lab", "es": "Laboratorio", "fr": "Labo", "de": "Labor", "pt": "Laboratório", "it": "Laboratorio" },
  Pro: { "en": "Pro", "es": "Pro", "fr": "Pro", "de": "Pro", "pt": "Pro", "it": "Pro" },
  Tech: { "en": "Tech", "es": "Tecnología", "fr": "Tech", "de": "Tech", "pt": "Tecnologia", "it": "Tech" },
  Works: { "en": "Works", "es": "Obras", "fr": "Works", "de": "Werke", "pt": "Obras", "it": "Lavori" },
}

export function BusinessNameGenerator() {
  const [industry, setIndustry] = useState("")
  const [keywords, setKeywords] = useState("")
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])

  const generateNames = () => {
    const keywordList = keywords.split(",").map(k => k.trim()).filter(k => k)
    const names: GeneratedName[] = []

    // Generate combinations
    for (let i = 0; i < 10; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
      const keyword = keywordList.length > 0 ? keywordList[Math.floor(Math.random() * keywordList.length)] : ""
      
      const variations = [
        `${prefix}${keyword}`,
        `${keyword}${suffix}`,
        `${prefix}${suffix}`,
        `${keyword}${industry}`,
        `${industry}${suffix}`,
      ]

      const name = variations[Math.floor(Math.random() * variations.length)]
        .replace(/\s+/g, "")
        .toLowerCase()

      const translations: Record<string, string> = {}
      Object.keys(translations).forEach(lang => {
        translations[lang] = getTranslation(name, lang)
      })

      names.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        translations
      })
    }

    setGeneratedNames(names)
  }

  const getTranslation = (name: string, lang: string): string => {
    // Simple translation simulation
    const parts = name.split(/(?=[A-Z])/)
    const translated = parts.map(part => {
      const lowerPart = part.toLowerCase()
      return nameTranslations[part]?.[lang] || part
    })
    return translated.join(" ")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Generador de Nombres para Negocios</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ingresa tu industria y palabras clave para generar nombres creativos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="industry">Industria</FieldLabel>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full mt-2 rounded-xl border border-border bg-background px-4 py-3"
            >
              <option value="">Selecciona una industria</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="keywords">Palabras clave (separadas por coma)</FieldLabel>
            <input
              id="keywords"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="ej: rápido, moderno, innovador"
              className="w-full mt-2 rounded-xl border border-border bg-background px-4 py-3"
            />
          </div>

          <ActionButton onClick={generateNames} disabled={!industry} className="w-full">
            <Sparkles className="size-4 mr-2" /> Generar Nombres
          </ActionButton>
        </div>
      </div>

      {generatedNames.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="size-5 text-primary" />
            <h3 className="text-lg font-semibold">Nombres Generados</h3>
          </div>

          <div className="space-y-4">
            {generatedNames.map((item, index) => (
              <div key={index} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold">{item.name}</h4>
                      <button
                        onClick={() => copyToClipboard(item.name)}
                        className="p-1 rounded hover:bg-muted"
                      >
                        <Copy className="size-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="flex items-start gap-2">
                      <Languages className="size-4 text-muted-foreground mt-0.5" />
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(item.translations).map(([lang, translation]) => (
                          <span key={lang} className="text-xs px-2 py-1 rounded-full bg-muted">
                            {translations[lang as keyof typeof translations]}: {translation}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ActionButton onClick={generateNames} variant="outline" className="w-full mt-6">
            <RefreshCw className="size-4 mr-2" /> Generar Más Nombres
          </ActionButton>
        </div>
      )}
    </div>
  )
}
