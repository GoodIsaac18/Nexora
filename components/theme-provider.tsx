"use client"

import { useEffect } from "react"

export function ThemeProvider() {
  useEffect(() => {
    try {
      const t = localStorage.getItem('theme')
      const m = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (t === 'dark' || (!t && m)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      if (t) {
        document.documentElement.classList.add(t)
      }
    } catch (e) {
      console.error('Error setting theme:', e)
    }
  }, [])

  return null
}
