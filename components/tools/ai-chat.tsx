"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Sparkles, AlertCircle, Trash2, ThumbsUp, ThumbsDown, ExternalLink, Paperclip, X } from "lucide-react"
import { secureInput } from "@/lib/security"
import { useRouter } from "next/navigation"

interface Message {
  role: "user" | "assistant"
  content: string
  toolId?: string
  toolUrl?: string
  confidence?: number
  suggestions?: Array<{ id: string; name: string; description: string }>
  fromCache?: boolean
  rating?: "up" | "down"
  attachments?: Array<{ name: string; type: string; size: number }>
}

export function AiChat() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy tu asistente de IA completo. Puedo ayudarte con cualquier tarea, analizar documentos (PDF, Word), responder preguntas, y mucho más. ¿En qué puedo ayudarte hoy?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0 || isLoading || isCooldown) return

    // Sanitizar input
    const { sanitized, isValid } = secureInput(input, {
      maxLength: 2000,
      minLength: 1
    })

    if (!isValid && input.trim()) {
      setError("El mensaje contiene caracteres no permitidos o excede el límite de longitud.")
      return
    }

    const userMessage = sanitized || ""
    const attachmentData = attachments.map(att => ({
      name: att.name,
      type: att.type,
      size: att.size
    }))
    
    setInput("")
    setAttachments([])
    setError(null)
    setMessages(prev => [...prev, { 
      role: "user", 
      content: userMessage,
      attachments: attachmentData.length > 0 ? attachmentData : undefined
    }])
    setIsLoading(true)
    setIsCooldown(true)

    try {
      const formData = new FormData()
      formData.append("message", userMessage)
      formData.append("history", JSON.stringify(messages.slice(-5)))
      
      // Agregar archivos adjuntos
      attachments.forEach(file => {
        formData.append("files", file)
      })

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al procesar el mensaje")
      }

      const data = await response.json()
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.response,
        toolId: data.toolId,
        toolUrl: data.toolUrl,
        confidence: data.confidence,
        suggestions: data.suggestions,
        fromCache: data.fromCache
      }])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar el mensaje. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsCooldown(false), 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "¡Hola! Soy tu asistente de IA completo. Puedo ayudarte con cualquier tarea, analizar documentos (PDF, Word), responder preguntas, y mucho más. ¿En qué puedo ayudarte hoy?"
      }
    ])
    setError(null)
    setIsCooldown(false)
    setAttachments([])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown'
      ]
      const maxSize = 10 * 1024 * 1024 // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize
    })

    if (validFiles.length === 0) {
      setError("Solo se permiten archivos PDF, Word, TXT o Markdown de máximo 10MB")
      return
    }

    setAttachments(prev => [...prev, ...validFiles])
    setError(null)
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleRating = (index: number, rating: "up" | "down") => {
    setMessages(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], rating }
      return updated
    })
  }

  const navigateToTool = (toolUrl: string) => {
    router.push(toolUrl)
  }

  return (
    <div className="flex flex-col h-[70vh] sm:h-[600px]">
        <div className="flex items-center justify-between border-b border-border p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex size-8 sm:size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4 sm:size-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold sm:text-base">Asistente IA Completo</h3>
            <p className="text-xs text-muted-foreground">Analiza documentos, responde preguntas</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Limpiar chat"
        >
          <Trash2 className="size-4 sm:size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <span className={`flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-full ${
              msg.role === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              {msg.role === "user" ? <User className="size-4 sm:size-5" /> : <Bot className="size-4 sm:size-5" />}
            </span>
            <div className={`flex-1 space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
              <div className={`inline-block rounded-2xl px-4 py-2 max-w-[80%] ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}>
                <p className="text-sm sm:text-base">{msg.content}</p>
                {msg.fromCache && (
                  <p className="text-xs opacity-70 mt-1">⚡ Respuesta en caché</p>
                )}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.attachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs opacity-75">
                        <Paperclip className="size-3" />
                        <span>{att.name}</span>
                        <span className="opacity-60">({(att.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Tool suggestion with direct link */}
              {msg.toolUrl && (
                <div className="mt-2">
                  <button
                    onClick={() => navigateToTool(msg.toolUrl!)}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/40 hover:bg-primary/10"
                  >
                    <ExternalLink className="size-4" />
                    Ir a herramienta
                  </button>
                </div>
              )}

              {/* Fallback suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-muted-foreground">Opciones sugeridas:</p>
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => navigateToTool(`/${suggestion.id}`)}
                      className="block w-full text-left rounded-lg border border-border bg-card px-3 py-2 text-sm transition-all hover:border-primary/30 hover:bg-muted/50"
                    >
                      <span className="font-medium">{suggestion.name}</span>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Rating buttons for assistant messages */}
              {msg.role === "assistant" && index > 0 && !msg.rating && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleRating(index, "up")}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-green-500/10 hover:text-green-600"
                    title="Útil"
                  >
                    <ThumbsUp className="size-4" />
                  </button>
                  <button
                    onClick={() => handleRating(index, "down")}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
                    title="No útil"
                  >
                    <ThumbsDown className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <span className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bot className="size-4 sm:size-5 animate-pulse" />
            </span>
            <div className="flex-1">
              <div className="inline-block rounded-2xl bg-muted px-4 py-2">
                <p className="text-sm sm:text-base">Pensando...</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mx-3 mb-2 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 sm:mx-4">
          <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Suggestion chips */}
      <div className="px-3 pb-2 sm:px-4">
        <div className="flex flex-wrap gap-2">
          {["Generar contraseña", "Convertir PDF", "Comprimir imagen", "Formatear JSON"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-muted/50 sm:text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-3 sm:p-4">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm"
              >
                <Paperclip className="size-3 text-muted-foreground" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border border-border bg-background px-3 py-3 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            title="Adjuntar archivo (PDF, Word, TXT)"
          >
            <Paperclip className="size-4 sm:size-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe lo que necesitas hacer o adjunta un documento..."
            disabled={isLoading || isCooldown}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-base"
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && attachments.length === 0) || isLoading || isCooldown}
            className="rounded-xl bg-primary px-4 py-3 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
          >
            <Send className="size-4 sm:size-5" />
          </button>
        </div>
        {isCooldown && (
          <p className="mt-2 text-xs text-muted-foreground">Espera un momento antes de enviar otro mensaje...</p>
        )}
      </div>
    </div>
  )
}
