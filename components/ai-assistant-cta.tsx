"use client"

import { Sparkles } from "lucide-react"

export function AIAssistantCTA() {
  const handleOpenChatbot = () => {
    window.dispatchEvent(new CustomEvent('open-chatbot'))
  }

  return (
    <button
      onClick={handleOpenChatbot}
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95 sm:h-14 sm:px-8 sm:text-base"
    >
      <Sparkles className="size-4 sm:size-5" />
      Hablar con el asistente
    </button>
  )
}
