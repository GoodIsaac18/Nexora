"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Sparkles, AlertCircle, Trash2 } from "lucide-react"
import { ActionButton, FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"
import { secureInput } from "@/lib/security"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy tu asistente de IA. Puedo ayudarte con cualquier pregunta o tarea. ¿En qué puedo ayudarte hoy?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading || isCooldown) return

    // Sanitizar input
    const { sanitized, isValid } = secureInput(input, {
      maxLength: 2000,
      minLength: 1
    })

    if (!isValid) {
      setError("El mensaje contiene caracteres no permitidos o excede el límite de longitud.")
      return
    }

    const userMessage = sanitized
    setInput("")
    setError(null)
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setIsCooldown(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages.slice(-5) // Enviar últimos 5 mensajes para contexto
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al procesar el mensaje")
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.response }])
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
        content: "¡Hola! Soy tu asistente de IA. Puedo ayudarte con cualquier pregunta o tarea. ¿En qué puedo ayudarte hoy?"
      }
    ])
    setError(null)
    setIsCooldown(false)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 sm:px-0">
      <Panel className="flex flex-col h-[600px] sm:h-[700px]">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bot className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Asistente de IA</h3>
              <p className="text-xs text-muted-foreground">Powered by Google AI</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            title="Limpiar chat"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="size-4 text-primary" />
                </div>
              )}
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="size-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="size-4 text-primary animate-pulse" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
                <p className="animate-pulse">Pensando...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-3">
              <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading || isCooldown}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none"
              rows={2}
              maxLength={2000}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isCooldown}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-50 self-end"
            >
              {isLoading ? (
                <Sparkles className="size-5 animate-pulse" />
              ) : (
                <Send className="size-5" />
              )}
            </button>
          </div>
          {input.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {input.length}/2000 caracteres
            </p>
          )}
        </div>
      </Panel>

      <p className="text-xs text-muted-foreground px-4 sm:px-0">
        El chat usa Google AI (Gemini 3.5 Flash Lite). Hay un límite de 2 segundos entre peticiones para no saturar la API.
      </p>
    </div>
  )
}
