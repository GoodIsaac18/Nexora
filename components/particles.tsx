"use client"

import { useEffect, useRef } from "react"

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      baseSize: number
    }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const getRandomColor = () => {
      const colors = [
        "rgba(59, 130, 246,",  // blue-500
        "rgba(139, 92, 246,",  // violet-500
        "rgba(236, 72, 153,",  // pink-500
        "rgba(16, 185, 129,",  // emerald-500
        "rgba(245, 158, 11,",  // amber-500
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    const initParticles = () => {
      particles.length = 0
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000))
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 2
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: size,
          baseSize: size,
          opacity: Math.random() * 0.4 + 0.3,
          color: getRandomColor()
        })
      }
    }

    const connectParticles = () => {
      const maxDistance = 180
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.25
            ctx.beginPath()
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.lineWidth = 0.8
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scrollY = window.scrollY
      const scrollFactor = 1 + (scrollY / 1000) // Partículas crecen con el scroll

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Efecto de pulso suave
        const pulse = 1 + Math.sin(Date.now() * 0.002 + particle.x) * 0.1
        particle.size = particle.baseSize * pulse * scrollFactor

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${particle.opacity})`
        ctx.fill()
      })

      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-50"
      style={{ zIndex: 0 }}
    />
  )
}
