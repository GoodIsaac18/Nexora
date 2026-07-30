/**
 * Utilidades de seguridad para sanitizar inputs y prevenir ataques
 */

// Sanitiza texto para prevenir XSS
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Elimina < y >
    .replace(/javascript:/gi, '') // Elimina javascript:
    .replace(/on\w+=/gi, '') // Elimina event handlers como onclick=
    .replace(/data:/gi, '') // Elimina data: URIs
    .replace(/vbscript:/gi, '') // Elimina vbscript:
    .trim()
}

// Valida longitud de input
export function validateLength(input: string, min: number, max: number): boolean {
  const sanitized = sanitizeInput(input)
  return sanitized.length >= min && sanitized.length <= max
}

// Valida que el input solo contenga caracteres permitidos
export function validateAllowedChars(input: string, allowedPattern: RegExp): boolean {
  return allowedPattern.test(input)
}

// Patrones comunes para validación
export const PATTERNS = {
  text: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s.,!?;:'"()-]+$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
}

// Sanitiza y valida input completo
export function secureInput(input: string, options: {
  maxLength?: number
  minLength?: number
  pattern?: RegExp
}): { sanitized: string; isValid: boolean } {
  const sanitized = sanitizeInput(input)
  
  if (options.maxLength && sanitized.length > options.maxLength) {
    return { sanitized: sanitized.slice(0, options.maxLength), isValid: false }
  }
  
  if (options.minLength && sanitized.length < options.minLength) {
    return { sanitized, isValid: false }
  }
  
  if (options.pattern && !options.pattern.test(sanitized)) {
    return { sanitized, isValid: false }
  }
  
  return { sanitized, isValid: true }
}
