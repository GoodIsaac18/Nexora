"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Command, Clock, Star } from "lucide-react"
import { tools, availableTools } from "@/lib/tools"
import { useRecentTools } from "@/hooks/use-recent-tools"
import { cn } from "@/lib/utils"

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { recentTools } = useRecentTools()
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredTools = availableTools().filter(tool =>
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())) ||
    tool.slug.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSelect = (slug: string) => {
    router.push(`/${slug}`)
    setIsOpen(false)
    setQuery("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Search className="size-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar herramientas..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-lg border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {query === "" && recentTools.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
                <Clock className="size-4" />
                Recientes
              </div>
              {recentTools.map((recent) => {
                const tool = tools.find(t => t.slug === recent.slug)
                if (!tool) return null
                const Icon = tool.icon
                return (
                  <button
                    key={recent.slug}
                    onClick={() => handleSelect(recent.slug)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-medium">{tool.name}</span>
                  </button>
                )
              })}
            </div>
          )}

          {filteredTools.length > 0 ? (
            <div>
              {query === "" && (
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <Star className="size-4" />
                  Todas las herramientas
                </div>
              )}
              {filteredTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <button
                    key={tool.slug}
                    onClick={() => handleSelect(tool.slug)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div className="flex-1">
                      <span className="font-medium">{tool.name}</span>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No se encontraron herramientas
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
              ↑↓
            </kbd>
            <span>Navegar</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
              ↵
            </kbd>
            <span>Seleccionar</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
              ESC
            </kbd>
            <span>Cerrar</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CommandPaletteTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-xs sm:inline-flex">
          <Command className="size-3" />K
        </kbd>
      </button>
      {isOpen && <CommandPaletteWrapper onClose={() => setIsOpen(false)} />}
    </>
  )
}

function CommandPaletteWrapper({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  if (!isOpen) return null

  return <CommandPaletteWrapperContent onClose={handleClose} />
}

function CommandPaletteWrapperContent({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { recentTools } = useRecentTools()
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredTools = availableTools().filter(tool =>
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())) ||
    tool.slug.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSelect = (slug: string) => {
    router.push(`/${slug}`)
    onClose()
    setQuery("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Search className="size-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar herramientas..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-lg border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {query === "" && recentTools.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
                <Clock className="size-4" />
                Recientes
              </div>
              {recentTools.map((recent) => {
                const tool = tools.find(t => t.slug === recent.slug)
                if (!tool) return null
                const Icon = tool.icon
                return (
                  <button
                    key={recent.slug}
                    onClick={() => handleSelect(recent.slug)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-medium">{tool.name}</span>
                  </button>
                )
              })}
            </div>
          )}

          {filteredTools.length > 0 ? (
            <div>
              {query === "" && (
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <Star className="size-4" />
                  Todas las herramientas
                </div>
              )}
              {filteredTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <button
                    key={tool.slug}
                    onClick={() => handleSelect(tool.slug)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div className="flex-1">
                      <span className="font-medium">{tool.name}</span>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No se encontraron herramientas
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
              ↑↓
            </kbd>
            <span>Navegar</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
              ↵
            </kbd>
            <span>Seleccionar</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
              ESC
            </kbd>
            <span>Cerrar</span>
          </div>
        </div>
      </div>
    </div>
  )
}
