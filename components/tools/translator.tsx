"use client"

import { useState } from "react"
import { Languages, Copy, Check, ArrowRightLeft } from "lucide-react"
import { ActionButton, FieldLabel } from "@/components/tools/ui"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
]

export function Translator() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)

  const translateText = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)
    
    try {
      // Using MyMemory free translation API
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`
      )
      const data = await response.json()
      
      if (data.responseStatus === 200) {
        setTranslatedText(data.responseData.translatedText)
      } else {
        setTranslatedText("Error en la traducción. Intenta de nuevo.")
      }
    } catch (error) {
      setTranslatedText("Error de conexión. Verifica tu internet.")
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    const tempLang = sourceLang
    setSourceLang(targetLang)
    setTargetLang(tempLang)
    
    if (translatedText) {
      setSourceText(translatedText)
      setTranslatedText(sourceText)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Languages className="size-4 sm:size-5" />
          <h3 className="text-base sm:text-lg font-semibold">Traductor</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <FieldLabel htmlFor="source-lang">Idioma de origen</FieldLabel>
            <select
              id="source-lang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full h-10 sm:h-11 rounded-xl border border-border bg-background px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <FieldLabel htmlFor="target-lang">Idioma destino</FieldLabel>
              <select
                id="target-lang"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full h-10 sm:h-11 rounded-xl border border-border bg-background px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={swapLanguages}
              className="h-10 sm:h-11 w-10 sm:w-11 flex items-center justify-center rounded-xl border border-border bg-background hover:bg-muted transition-colors shrink-0"
              title="Intercambiar idiomas"
            >
              <ArrowRightLeft className="size-4 sm:size-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <FieldLabel htmlFor="source-text">Texto original</FieldLabel>
            <textarea
              id="source-text"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Escribe o pega el texto a traducir..."
              className="rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={5}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel htmlFor="translated-text">Traducción</FieldLabel>
              {translatedText && (
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-muted"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 sm:size-4" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="size-3 sm:size-4" /> Copiar
                    </>
                  )}
                </button>
              )}
            </div>
            <textarea
              id="translated-text"
              value={translatedText}
              readOnly
              placeholder="La traducción aparecerá aquí..."
              className="rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={5}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton onClick={translateText} disabled={!sourceText.trim() || isTranslating} className="flex-1 sm:flex-none">
            {isTranslating ? (
              <>
                <Languages className="size-3 sm:size-4 animate-spin" /> Traduciendo…
              </>
            ) : (
              <>
                <Languages className="size-3 sm:size-4" /> Traducir
              </>
            )}
          </ActionButton>
          <button
            onClick={() => {
              setSourceText("")
              setTranslatedText("")
            }}
            className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-border bg-background px-4 sm:px-6 text-xs sm:text-sm font-medium transition-colors hover:bg-muted"
          >
            Limpiar
          </button>
        </div>
      </div>

      <p className="text-[10px] sm:text-xs text-muted-foreground">
        Traducción proporcionada por MyMemory Translation API. Para textos largos o traducciones profesionales, considera usar servicios especializados.
      </p>
    </div>
  )
}
