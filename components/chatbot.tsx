"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  toolSuggestion?: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy el asistente de Nexora. Puedo ayudarte a encontrar la herramienta adecuada. ¿Qué necesitas hacer? (ej: parafrasear texto, analizar CV, convertir divisas, etc.)"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading || isCooldown) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setIsCooldown(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      })

      if (!response.ok) {
        throw new Error("Error al procesar el mensaje")
      }

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        toolSuggestion: data.toolSuggestion
      }])

      // Si hay sugerencia de herramienta, navegar a ella
      if (data.toolSuggestion) {
        setTimeout(() => {
          window.location.href = `/${data.toolSuggestion}`
        }, 1500)
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Lo siento, hubo un error. Por favor intenta de nuevo."
      }])
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

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Abrir chatbot"
      >
        {isOpen ? (
          <X className="size-6" />
        ) : (
          <MessageCircle className="size-6" />
        )}
      </button>

      {/* Modal del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-96 flex-col rounded-2xl border border-border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bot className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Asistente Nexora</h3>
              <p className="text-xs text-muted-foreground">Conoce todas las herramientas</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex h-96 flex-col overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="size-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  {message.toolSuggestion && (
                    <p className="mt-2 text-xs opacity-75">
                      🚀 Redirigiendo a {message.toolSuggestion}...
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="size-4 text-primary animate-pulse" />
                </div>
                <div className="rounded-2xl bg-muted px-4 py-2 text-sm">
                  <p className="animate-pulse">Pensando...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading || isCooldown}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isCooldown}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
