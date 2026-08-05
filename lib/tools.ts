import type { LucideIcon } from "lucide-react"
import {
  Braces,
  KeyRound,
  Palette,
  FingerprintPattern,
  FileCode2,
  Tags,
  Hash,
  Baseline,
  Type,
  Link2,
  Clock,
  Ruler,
  QrCode,
  Scan,
  Wifi,
  Image as ImageIcon,
  Lock,
  ScanText,
  Calculator,
  Sparkles,
  Shield,
  MessageCircle,
  Minimize2,
  Megaphone,
  Download,
  Video,
  Music,
  Play,
  Camera,
  Monitor,
  FileText,
  Unlock,
  Merge,
  Scissors,
  Minimize,
  Languages,
  DollarSign,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Image,
  MessageSquare,
} from "lucide-react"

export const SITE = {
  name: "Anubis AI",
  tagline: "Fast, free tools for developers & creators",
  description:
    "A growing collection of fast, privacy-friendly online tools. Format JSON, generate passwords, pick colors, convert Markdown and more — all in your browser.",
  url: "https://nexora-jade-eta.vercel.app",
}

export type ToolCategory = {
  slug: string
  name: string
  description: string
}

export type Tool = {
  slug: string
  title: string
  /** Short label used in cards and nav */
  name: string
  description: string
  /** Longer copy used on the tool page + meta description */
  longDescription: string
  category: string
  keywords: string[]
  icon: LucideIcon
  /** Icon name for client components (optional, derived from icon if not provided) */
  iconName?: string
  /** true once the page under /app/<slug>/page.tsx exists */
  available: true
  /** Optional custom guide for the tool */
  guide?: string
  /** Optional custom FAQ for the tool */
  faq?: { question: string; answer: string }[]
  /** Optional related tool slugs for tool chaining */
  relatedTools?: string[]
  /** SEO meta description (max 160 chars, includes primary keyword) */
  metaDescription?: string
  /** Primary SEO keyword for ranking */
  primaryKeyword?: string
  /** Open Graph image for social sharing */
  ogImage?: string
  /** Use cases for the tool */
  useCases?: string[]
}

export const categories: ToolCategory[] = [
  { slug: "converters", name: "Converters", description: "Transform data from one format into another." },
  { slug: "generators", name: "Generators", description: "Create IDs, passwords, tokens and boilerplate." },
  { slug: "text", name: "Text & Content", description: "Manipulate, count and clean up text." },
  { slug: "web", name: "Web & SEO", description: "Utilities for building and ranking websites." },
  { slug: "design", name: "Design & Color", description: "Pick colors and craft visual assets." },
  { slug: "media", name: "Media & Video", description: "Download and convert videos from popular platforms." },
  { slug: "images", name: "Images & Visual", description: "Compress, convert, and optimize images locally." },
  { slug: "development", name: "Development", description: "Tools for developers and code manipulation." },
  { slug: "pdf", name: "PDF Tools", description: "Convert, merge, split and manipulate PDF files." },
]

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    title: "JSON Formatter & Validator - Formatear JSON Gratis",
    description: "Format, minify and validate JSON instantly.",
    longDescription:
      "Format messy JSON into clean, readable output, minify it for production, and catch syntax errors as you type. Ideal for APIs, configs and debugging.",
    category: "converters",
    keywords: [
      "json formatter",
      "json validator",
      "json beautifier",
      "format json online",
      "pretty print json",
      "minify json",
      "formatear json",
      "json formatter online"
    ],
    icon: Braces,
    iconName: "Braces",
    available: true,
    primaryKeyword: "json formatter online",
    metaDescription: "Formatea y valida JSON online gratis. Detecta errores de sintaxis al instante. JSON limpio y legible en segundos.",
    ogImage: "/images/json-formatter-og.jpg",
    useCases: [
      "Depurar APIs y respuestas JSON",
      "Formatear archivos de configuración",
      "Validar estructura de datos JSON"
    ],
    guide: "Pega tu JSON en el área de texto, haz clic en 'Format' para verlo estructurado, o 'Minify' para compactarlo. Si hay errores, se mostrarán en rojo.",
    faq: [
      {
        question: "¿Puedo validar JSON?",
        answer: "Sí. Detecta errores de sintaxis en tiempo real mientras escribes.",
      },
      {
        question: "¿Puedo minificar el JSON?",
        answer: "Sí. Puedes compactarlo para producción con un solo clic.",
      },
    ],
    relatedTools: ["base64-encoder", "url-encoder", "jwt-decoder"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    title: "Generador de Contraseñas Seguras - Gratis Online",
    description: "Generate strong random passwords with custom rules.",
    longDescription:
      "Generate strong random passwords with adjustable length, symbols, numbers and casing. Includes a live strength meter and runs entirely in your browser.",
    category: "generators",
    keywords: [
      "password generator",
      "random password",
      "strong password",
      "secure password",
      "generador de contraseñas",
      "generador de contraseñas gratis",
      "crear contraseñas seguras",
      "password generator online",
    ],
    icon: KeyRound,
    iconName: "KeyRound",
    available: true,
    primaryKeyword: "password generator free",
    metaDescription: "Genera contraseñas seguras y fuertes gratis. Longitud personalizada, símbolos, números. Generador de contraseñas online seguro.",
    ogImage: "/images/password-generator-og.jpg",
    useCases: [
      "Crear contraseñas para cuentas nuevas",
      "Generar contraseñas para Wi-Fi",
      "Renovar contraseñas existentes",
    ],
    guide: "Elige la longitud, activa o desactiva mayúsculas, números y símbolos, y luego genera una contraseña nueva hasta encontrar una combinación que te guste.",
    faq: [
      {
        question: "¿Puedo generar contraseñas de diferentes longitudes?",
        answer: "Sí. Puedes generar contraseñas desde cortas hasta muy largas según lo que necesites.",
      },
      {
        question: "¿Son seguras las contraseñas generadas?",
        answer: "Sí. Usa criptografía segura del navegador y no guardamos ninguna contraseña.",
      },
      {
        question: "¿Se guardan las contraseñas?",
        answer: "No. Todo se genera localmente en tu navegador. No enviamos nada a servidores.",
      },
    ],
    relatedTools: ["uuid-generator", "hash-generator", "jwt-decoder"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    title: "Generador UUID - GUID v4 Gratis Online",
    description: "Generate v4 UUIDs in bulk and copy them fast.",
    longDescription:
      "Generate RFC 4122 version 4 UUIDs one at a time or in bulk. Copy individual values or the whole list with a single click.",
    category: "generators",
    keywords: [
      "uuid generator",
      "guid generator",
      "random uuid",
      "generate uuid",
      "generador uuid gratis",
      "uuid v4 online",
      "generador guid",
      "uuid tool"
    ],
    icon: Hash,
    iconName: "Hash",
    available: true,
    primaryKeyword: "uuid generator free",
    metaDescription: "Genera UUID v4 online gratis. Generador de UUIDs en masa. Identificadores únicos aleatorios. Copiar con un clic.",
    ogImage: "/images/uuid-generator-og.jpg",
    useCases: [
      "Generar IDs para bases de datos",
      "Crear identificadores únicos",
      "Generar GUIDs para aplicaciones"
    ],
    relatedTools: ["password-generator", "hash-generator", "jwt-decoder"],
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    title: "Color Picker & Converter",
    description: "Pick a color and convert between HEX, RGB and HSL.",
    longDescription:
      "Pick any color and instantly get its HEX, RGB and HSL values. Copy any format to your clipboard and preview it on light and dark backgrounds.",
    category: "design",
    keywords: ["color picker", "hex to rgb", "rgb to hex", "hsl converter", "color converter"],
    icon: Palette,
    iconName: "Palette",
    available: true,
  },
  {
    slug: "color-palette-generator",
    name: "Color Palette Generator",
    title: "Color Palette Generator",
    description: "Generate harmonious color palettes from any base color.",
    longDescription:
      "Create beautiful color palettes using color harmony rules like complementary, analogous, triadic, tetradic and monochromatic. Download your palettes as images.",
    category: "design",
    keywords: ["color palette", "color harmony", "color scheme", "palette generator", "color combinations"],
    icon: Palette,
    iconName: "Palette",
    available: true,
  },
  {
    slug: "gradient-generator",
    name: "Gradient Generator",
    title: "CSS Gradient Generator",
    description: "Create beautiful CSS gradients with multiple colors.",
    longDescription:
      "Design linear and radial CSS gradients with multiple color stops. Customize direction, colors, and positions. Copy the CSS code or download it as a file.",
    category: "design",
    keywords: ["gradient generator", "css gradient", "linear gradient", "radial gradient", "color gradient"],
    icon: Palette,
    iconName: "Palette",
    available: true,
  },
  {
    slug: "color-contrast-checker",
    name: "Color Contrast Checker",
    title: "WCAG Color Contrast Checker",
    description: "Check if your colors meet accessibility standards.",
    longDescription:
      "Verify color combinations against WCAG accessibility guidelines. Get contrast ratios and see if your colors pass AA and AAA standards for normal and large text.",
    category: "design",
    keywords: ["color contrast", "wcag checker", "accessibility", "contrast ratio", "color accessibility"],
    icon: Palette,
    iconName: "Palette",
    available: true,
  },
  {
    slug: "box-shadow-generator",
    name: "Box Shadow Generator",
    title: "CSS Box Shadow Generator",
    description: "Create beautiful box shadows with live preview.",
    longDescription:
      "Design CSS box shadows with controls for horizontal and vertical offset, blur, spread, color and opacity. Preview on different backgrounds and copy the CSS code.",
    category: "design",
    keywords: ["box shadow", "css shadow", "shadow generator", "drop shadow", "box-shadow css"],
    icon: Palette,
    iconName: "Palette",
    available: true,
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    title: "Smart Tip Calculator",
    description: "Calculate tips and split bills easily.",
    longDescription:
      "Calculate tips with percentages (10%, 15%, 20% or custom), apply discounts, and split bills between multiple people. Perfect for restaurants, bars, and group outings.",
    category: "converters",
    keywords: ["tip calculator", "bill splitter", "tip calculator", "split bill", "restaurant tip"],
    icon: Calculator,
    iconName: "Calculator",
    available: true,
    primaryKeyword: "tip calculator split bill",
    metaDescription: "Calculate tips and split bills free. 10%, 15%, 20% or custom. Perfect for restaurants and groups.",
    relatedTools: ["calculator", "currency-converter", "unit-converter"],
  },
  {
    slug: "receipt-analyzer",
    name: "Receipt Analyzer",
    title: "AI Receipt Analyzer",
    description: "Upload receipts to detect overcharges and extract items.",
    longDescription:
      "Upload PDF or image receipts to automatically extract items, prices, and totals. Detect if you were overcharged and compare prices per unit. Uses AI to analyze your receipts.",
    category: "converters",
    keywords: ["receipt analyzer", "receipt scanner", "check overcharges", "receipt OCR", "analyze receipt"],
    icon: FileText,
    iconName: "FileText",
    available: true,
    primaryKeyword: "receipt scanner online",
    metaDescription: "Scan receipts online free. Detect overcharges and extract items with AI. Upload PDF or image receipts.",
    relatedTools: ["pdf-to-jpg", "image-compressor", "tip-calculator"],
  },
  {
    slug: "business-name-generator",
    name: "Business Name Generator",
    title: "Business Name Generator",
    description: "Generate creative business names with translations.",
    longDescription:
      "Generate creative business names based on your industry and keywords. Get translations in multiple languages (English, Spanish, French, German, Portuguese, Italian). Perfect for startups and entrepreneurs.",
    category: "generators",
    keywords: ["business name generator", "company name generator", "startup name", "brand name", "name ideas"],
    icon: Sparkles,
    iconName: "Sparkles",
    available: true,
    primaryKeyword: "business name generator free",
    metaDescription: "Generate creative business names free. Industry-based with translations. Perfect for startups and entrepreneurs.",
    relatedTools: ["slug-generator", "meta-tag-generator", "utm-link-builder"],
  },
  {
    slug: "fake-news-detector",
    name: "Fake News Detector",
    title: "Fake News & Misinformation Detector",
    description: "Verify if news or information is reliable.",
    longDescription:
      "Check if news or information is reliable using Google Fact Check Tools API. Get verification status, confidence scores, and sources. Includes resources for manual fact-checking.",
    category: "converters",
    keywords: ["fake news detector", "fact check", "misinformation", "verify news", "news verification"],
    icon: Shield,
    iconName: "Shield",
    available: true,
    primaryKeyword: "fake news detector",
    metaDescription: "Verify news and information online free. Check facts with Google Fact Check. Detect misinformation instantly.",
    relatedTools: ["ai-detector", "paraphraser", "ai-chat"],
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    title: "Markdown to HTML Converter",
    description: "Convert Markdown into clean HTML with live preview.",
    longDescription:
      "Write or paste Markdown and get clean HTML output with a live rendered preview. Supports headings, lists, links, code, blockquotes and more.",
    category: "converters",
    keywords: ["markdown to html", "md to html", "markdown converter", "markdown preview"],
    icon: FileCode2,
    iconName: "FileCode2",
    available: true,
    primaryKeyword: "markdown to html converter",
    metaDescription: "Convert Markdown to HTML online free. Live preview, clean output. Supports headings, lists, links, code.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    title: "Meta Tag & Open Graph Generator",
    description: "Generate SEO and social meta tags for any page.",
    longDescription:
      "Fill in your page details and instantly generate SEO meta tags plus Open Graph and Twitter Card markup, ready to paste into your <head>.",
    category: "web",
    keywords: ["meta tag generator", "open graph generator", "seo meta tags", "twitter card"],
    icon: Tags,
    iconName: "Tags",
    available: true,
    primaryKeyword: "meta tag generator",
    metaDescription: "Generate SEO meta tags free. Open Graph and Twitter Card markup. Perfect for social media optimization.",
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encode/Decode",
    title: "Base64 Encoder & Decoder",
    description: "Encode text to Base64 or decode it back.",
    longDescription:
      "Convert plain text to Base64 and decode Base64 back to text. Handles Unicode correctly and runs entirely in your browser.",
    category: "converters",
    keywords: ["base64 encode", "base64 decode", "base64 converter"],
    icon: Baseline,
    iconName: "Baseline",
    available: true,
    primaryKeyword: "base64 encoder decoder",
    metaDescription: "Encode and decode Base64 online free. Convert text to Base64 and back. Unicode support included.",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    title: "Contador de Palabras - Contar Caracteres Gratis",
    description: "Count words, characters, sentences and reading time.",
    longDescription:
      "Paste your text to see live counts for words, characters, sentences and paragraphs, plus an estimated reading time.",
    category: "text",
    keywords: [
      "word counter",
      "character counter",
      "reading time",
      "text counter",
      "contador de palabras gratis",
      "contar caracteres online",
      "contador de palabras español",
      "word counter tool"
    ],
    icon: ScanText,
    iconName: "ScanText",
    available: true,
    primaryKeyword: "word counter online",
    metaDescription: "Cuenta palabras y caracteres online gratis. Estimador de tiempo de lectura. Perfecto para escritores y estudiantes.",
    ogImage: "/images/word-counter-og.jpg",
    useCases: [
      "Contar palabras para ensayos",
      "Verificar límites de caracteres",
      "Calcular tiempo de lectura"
    ],
    relatedTools: ["case-converter", "paraphraser", "slug-generator", "translator"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    title: "Convertir Mayúsculas/Minúsculas - Cambiar Case Gratis",
    description: "Convert text between camelCase, snake_case and more.",
    longDescription:
      "Instantly convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case and CONSTANT_CASE.",
    category: "text",
    keywords: [
      "case converter",
      "camelcase",
      "snake case",
      "kebab case",
      "title case",
      "convertir mayusculas minusculas",
      "cambiar case online",
      "texto case converter",
      "case tool"
    ],
    icon: Type,
    iconName: "Type",
    available: true,
    primaryKeyword: "case converter online",
    metaDescription: "Convierte mayúsculas/minúsculas online gratis. camelCase, snake_case, kebab-case, Title Case. Conversión instantánea de texto.",
    ogImage: "/images/case-converter-og.jpg",
    useCases: [
      "Convertir texto a mayúsculas",
      "Cambiar a camelCase para código",
      "Normalizar formato de texto"
    ],
    relatedTools: ["word-counter", "paraphraser", "slug-generator", "translator"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    title: "Generador de Hash SHA - Criptografía Gratis",
    description: "Generate SHA-1, SHA-256 and SHA-512 hashes.",
    longDescription:
      "Generate cryptographic hashes (SHA-1, SHA-256, SHA-384, SHA-512) from any text using the browser's built-in Web Crypto API.",
    category: "generators",
    keywords: [
      "hash generator",
      "sha256 generator",
      "sha512",
      "checksum",
      "generador de hash gratis",
      "sha256 online",
      "generador hash criptografico",
      "hash tool"
    ],
    icon: Hash,
    iconName: "Hash",
    available: true,
    primaryKeyword: "sha256 hash generator",
    metaDescription: "Genera hashes SHA-256, SHA-512 online gratis. Generador de checksum criptográfico. Hash seguro basado en navegador.",
    ogImage: "/images/hash-generator-og.jpg",
    useCases: [
      "Generar hash para contraseñas",
      "Crear checksum de archivos",
      "Verificar integridad de datos"
    ],
    relatedTools: ["password-generator", "uuid-generator", "jwt-decoder"],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    title: "Codificar URL - Encoder/Decoder Gratis",
    description: "Encode or decode URL components safely.",
    longDescription:
      "Encode text for safe use in URLs and decode percent-encoded strings back to readable text.",
    category: "converters",
    keywords: [
      "url encoder",
      "url decoder",
      "percent encoding",
      "uri encode",
      "codificar url gratis",
      "decodificar url online",
      "url encoder decoder",
      "uri encoding tool"
    ],
    icon: Link2,
    iconName: "Link2",
    available: true,
    primaryKeyword: "url encoder decoder",
    metaDescription: "Codifica y decodifica URLs online gratis. Percent encoding y URI encoding. Conversión segura de componentes URL.",
    ogImage: "/images/url-encoder-og.jpg",
    useCases: [
      "Codificar parámetros de URL",
      "Decodificar URLs codificadas",
      "Preparar URLs para APIs"
    ],
    relatedTools: ["base64-encoder", "jwt-decoder", "markdown-to-html"],
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum",
    title: "Generador Lorem Ipsum - Texto Placeholder Gratis",
    description: "Generate placeholder paragraphs, sentences or words.",
    longDescription:
      "Generate classic lorem ipsum placeholder text by paragraphs, sentences or words for mockups and prototypes.",
    category: "generators",
    keywords: [
      "lorem ipsum generator",
      "placeholder text",
      "dummy text",
      "texto placeholder gratis",
      "generar lorem ipsum online",
      "texto dummy diseño",
      "lorem ipsum tool",
      "placeholder generator"
    ],
    icon: ScanText,
    iconName: "ScanText",
    available: true,
    primaryKeyword: "lorem ipsum generator",
    metaDescription: "Genera texto placeholder Lorem Ipsum gratis. Párrafos, oraciones, palabras. Perfecto para mockups y prototipos.",
    ogImage: "/images/lorem-ipsum-generator-og.jpg",
    useCases: [
      "Crear mockups de diseño",
      "Generar texto para prototipos",
      "Rellenar espacios en wireframes"
    ],
    relatedTools: ["word-counter", "slug-generator", "business-name-generator"],
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    title: "Convertir Timestamp Unix - Fecha Humana Gratis",
    description: "Convert between Unix timestamps and human dates.",
    longDescription: "Convert Unix timestamps to human-readable dates and back across time zones.",
    category: "converters",
    keywords: [
      "unix timestamp",
      "epoch converter",
      "timestamp to date",
      "convertir timestamp gratis",
      "unix timestamp online",
      "epoch a fecha",
      "timestamp converter tool",
      "fecha unix"
    ],
    icon: Clock,
    iconName: "Clock",
    available: true,
    primaryKeyword: "unix timestamp converter",
    metaDescription: "Convierte timestamps Unix a fechas online gratis. Convertidor epoch con soporte de zona horaria. Timestamp a fecha.",
    ogImage: "/images/timestamp-converter-og.jpg",
    useCases: [
      "Convertir timestamp a fecha legible",
      "Obtener timestamp actual",
      "Convertir fechas a Unix time"
    ],
    relatedTools: ["unit-converter", "calculator", "currency-converter"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    title: "Convertir Unidades - Métrico a Imperial Gratis",
    description: "Convert length, weight, temperature and more.",
    longDescription: "Convert between metric and imperial units for length, weight, temperature and volume.",
    category: "converters",
    keywords: [
      "unit converter",
      "metric to imperial",
      "length converter",
      "convertir unidades gratis",
      "conversor metrico imperial",
      "convertir peso temperatura",
      "unit converter online",
      "conversor de medidas"
    ],
    icon: Ruler,
    iconName: "Ruler",
    available: true,
    primaryKeyword: "unit converter online",
    metaDescription: "Convierte unidades online gratis. Longitud, peso, temperatura, volumen. Conversión métrico a imperial fácil.",
    ogImage: "/images/unit-converter-og.jpg",
    useCases: [
      "Convertir longitud metros a pies",
      "Cambiar peso kg a libras",
      "Convertir temperatura Celsius a Fahrenheit"
    ],
    relatedTools: ["calculator", "currency-converter", "timestamp-converter"],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    title: "Generador de Códigos QR - Gratis Online",
    description: "Turn any link or text into a downloadable QR code.",
    longDescription: "Generate QR codes for URLs, text, Wi-Fi credentials and more. Customize the size and download the result as PNG.",
    category: "generators",
    keywords: [
      "qr code generator",
      "qr code maker",
      "create qr code",
      "generador de qr",
      "generador de codigos qr gratis",
      "crear qr online",
      "qr code generator online",
      "qr para wifi"
    ],
    icon: QrCode,
    iconName: "QrCode",
    available: true,
    primaryKeyword: "qr code generator free",
    metaDescription: "Genera códigos QR gratis online. URLs, texto, Wi-Fi. Tamaño personalizado, descarga PNG. Perfecto para compartir.",
    ogImage: "/images/qr-code-generator-og.jpg",
    useCases: [
      "Crear QR para enlaces web",
      "Generar QR para Wi-Fi",
      "Crear QR para tarjetas de visita"
    ],
    guide: "Escribe un enlace, texto o credencial Wi-Fi, ajusta el tamaño y descarga el QR en PNG para compartirlo donde quieras.",
    faq: [
      {
        question: "¿Puedo crear QR para texto o enlaces?",
        answer: "Sí. Puedes generar códigos QR a partir de texto, URLs o credenciales Wi-Fi.",
      },
      {
        question: "¿Se genera en el navegador?",
        answer: "Sí. El QR se renderiza directamente en tu dispositivo.",
      },
      {
        question: "¿Puedo descargar la imagen?",
        answer: "Sí. Puedes descargar el QR como PNG.",
      },
    ],
    relatedTools: ["whatsapp-link-generator", "url-encoder", "wifi-qr-reader"],
  },
  {
    slug: "youtube-thumbnail-downloader",
    name: "YouTube Thumbnails",
    title: "YouTube Thumbnail Downloader",
    description: "Grab thumbnail images from any YouTube video.",
    longDescription: "Paste a YouTube link and download its thumbnail in every available resolution.",
    category: "web",
    keywords: ["youtube thumbnail downloader", "youtube thumbnail grabber"],
    icon: ImageIcon,
    iconName: "ImageIcon",
    available: true,
    primaryKeyword: "youtube thumbnail downloader",
    metaDescription: "Download YouTube thumbnails online free. All resolutions available. HD, SD, max quality thumbnail grabber.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    title: "Decodificar JWT Token - Inspeccionar Gratis",
    description: "Decode and inspect JWT tokens.",
    longDescription:
      "Paste a JWT token to instantly decode its header and payload. Inspect claims, expiration and issuer information. Runs entirely in your browser.",
    category: "converters",
    keywords: [
      "jwt decoder",
      "jwt token decoder",
      "decode jwt",
      "json web token",
      "decodificar jwt gratis",
      "inspeccionar token jwt",
      "jwt decoder online",
      "json web token tool"
    ],
    icon: Lock,
    iconName: "Lock",
    available: true,
    primaryKeyword: "jwt decoder online",
    metaDescription: "Decodifica tokens JWT online gratis. Inspecciona header y payload. JSON Web Token decoder. Procesamiento local.",
    ogImage: "/images/jwt-decoder-og.jpg",
    useCases: [
      "Decodificar tokens de autenticación",
      "Inspeccionar claims de JWT",
      "Verificar expiración de tokens"
    ],
    relatedTools: ["base64-encoder", "hash-generator", "password-generator"],
  },
  {
    slug: "whatsapp-link-generator",
    name: "WhatsApp Link",
    title: "Generador Enlace WhatsApp - wa.me Click-to-Chat Gratis",
    description: "Create wa.me links with optional pre-filled messages.",
    longDescription:
      "Build shareable WhatsApp click-to-chat links with country code, phone number and an optional pre-filled message. Copy wa.me or api.whatsapp.com formats.",
    category: "web",
    keywords: [
      "whatsapp link generator",
      "wa.me link",
      "click to chat whatsapp",
      "generador enlace whatsapp gratis",
      "crear link whatsapp",
      "whatsapp marketing tool",
      "wa.me generator",
      "click to chat tool"
    ],
    icon: MessageCircle,
    iconName: "MessageCircle",
    available: true,
    primaryKeyword: "whatsapp link generator",
    metaDescription: "Genera enlaces de WhatsApp online gratis. wa.me click-to-chat con mensajes prellenados. Perfecto para marketing.",
    ogImage: "/images/whatsapp-link-generator-og.jpg",
    useCases: [
      "Crear enlaces para marketing",
      "Generar links de contacto",
      "Compartir número con mensaje predefinido"
    ],
    relatedTools: ["qr-code-generator", "url-encoder", "utm-link-builder"],
  },
  {
    slug: "link-shortener",
    name: "Link Shortener",
    title: "Acortador de Enlaces - URL Shortener Gratis",
    description: "Shorten long URLs for easy sharing.",
    longDescription:
      "Paste a long URL and get a shorter link ready to share. Shortening is handled server-side via is.gd; we do not store your links.",
    category: "web",
    keywords: [
      "link shortener",
      "url shortener",
      "short link",
      "acortador de enlaces",
      "acortar url gratis",
      "shortener online",
      "url shortener free",
      "acortador de links"
    ],
    icon: Link2,
    iconName: "Link2",
    available: true,
    primaryKeyword: "url shortener free",
    metaDescription: "Acorta URLs online gratis. Crea enlaces cortos para compartir. Sin almacenamiento de links. Acortador rápido.",
    ogImage: "/images/link-shortener-og.jpg",
    useCases: [
      "Acortar URLs para redes sociales",
      "Compartir enlaces largos fácilmente",
      "Crear links cortos para marketing"
    ],
    relatedTools: ["qr-code-generator", "whatsapp-link-generator", "utm-link-builder"],
  },
  {
    slug: "utm-link-builder",
    name: "UTM Builder",
    title: "Constructor de Enlaces UTM - Campaign Tracking Gratis",
    description: "Add campaign tracking parameters to any URL.",
    longDescription:
      "Generate marketing URLs with utm_source, utm_medium, utm_campaign and optional term/content tags for analytics.",
    category: "web",
    keywords: [
      "utm builder",
      "utm generator",
      "campaign url",
      "utm link",
      "constructor enlaces utm gratis",
      "utm tracking tool",
      "campaign url builder",
      "utm link generator"
    ],
    icon: Megaphone,
    iconName: "Megaphone",
    available: true,
    primaryKeyword: "utm link builder",
    metaDescription: "Construye enlaces UTM online gratis. Parámetros de tracking de campañas. Generador utm_source, utm_medium, utm_campaign.",
    ogImage: "/images/utm-link-builder-og.jpg",
    useCases: [
      "Crear enlaces para campañas de marketing",
      "Rastrear tráfico de redes sociales",
      "Analizar fuentes de tráfico"
    ],
    relatedTools: ["link-shortener", "qr-code-generator", "whatsapp-link-generator"],
  },
  {
    slug: "tiktok-downloader",
    name: "TikTok Downloader",
    title: "TikTok Video Downloader - Sin Marca de Agua Gratis",
    description: "Download TikTok videos without watermark.",
    longDescription:
      "Paste a TikTok link and download videos without watermark in HD quality. Also extract audio as MP3. Fast and free.",
    category: "media",
    keywords: [
      "tiktok downloader",
      "tiktok video download",
      "tiktok no watermark",
      "descargar tiktok",
      "tiktok downloader sin marca",
      "tiktok to mp3",
      "descargar videos tiktok",
      "tiktok downloader hd"
    ],
    icon: Download,
    iconName: "Download",
    available: true,
    primaryKeyword: "tiktok downloader no watermark",
    metaDescription: "Descarga videos de TikTok sin marca de agua gratis. HD calidad. TikTok downloader en MP3 y MP4. ¡Rápido y fácil!",
    ogImage: "/images/tiktok-downloader-og.jpg",
    useCases: [
      "Guardar TikToks sin marca de agua",
      "Descargar audio de TikTok en MP3",
      "Crear compilaciones de TikToks"
    ],
    faq: [
      { question: "¿Funciona sin marca de agua?", answer: "Sí, descarga videos sin marca de agua" }
    ],
    relatedTools: ["instagram-downloader", "youtube-downloader", "x-video-downloader", "video-converter"],
  },
  {
    slug: "youtube-downloader",
    name: "YouTube Downloader",
    title: "YouTube Video Downloader - MP3 MP4 HD Gratis",
    description: "Download YouTube videos in multiple formats.",
    longDescription:
      "Download YouTube videos in various qualities including HD. Extract audio as MP3 or M4A. Choose from multiple format options.",
    category: "media",
    keywords: [
      "youtube downloader",
      "youtube video download",
      "youtube to mp3",
      "descargar youtube",
      "youtube downloader gratis",
      "youtube to mp4",
      "descargar videos youtube",
      "youtube downloader hd"
    ],
    icon: Download,
    iconName: "Download",
    available: true,
    primaryKeyword: "youtube downloader mp3",
    metaDescription: "Descarga videos de YouTube en MP3 y MP4 gratis. HD calidad. YouTube downloader sin marca de agua. ¡Rápido y fácil!",
    ogImage: "/images/youtube-downloader-og.jpg",
    useCases: [
      "Descargar música de YouTube en MP3",
      "Guardar videos para ver offline",
      "Extraer audio de videos"
    ],
    faq: [
      { question: "¿Es legal?", answer: "Solo para uso personal y contenido público" }
    ],
    relatedTools: ["youtube-thumbnail-downloader", "video-converter", "tiktok-downloader", "instagram-downloader"],
  },
  {
    slug: "instagram-downloader",
    name: "Instagram Downloader",
    title: "Instagram Video & Reel Downloader - Online Free Tool",
    description: "Download Instagram reels, stories and videos.",
    longDescription:
      "Download Instagram Reels, videos, and photo posts. Support for multiple media items in a single post. High quality downloads.",
    category: "media",
    keywords: [
      "instagram downloader",
      "instagram reel download",
      "instagram video download",
      "descargar instagram",
      "guardar reels instagram",
      "instagram downloader sin marca",
      "instagram to mp4",
      "descargador de reels gratis"
    ],
    icon: Download,
    iconName: "Download",
    available: true,
    primaryKeyword: "instagram downloader reels",
    metaDescription: "Descarga reels y videos de Instagram en MP4 gratis. Sin marca de agua. Herramienta rápida y segura. ¡Úsala ahora!",
    ogImage: "/images/instagram-downloader-og.jpg",
    useCases: [
      "Guardar reels favoritos para ver después",
      "Descargar videos de amigos",
      "Crear compilaciones de reels"
    ],
    faq: [
      { question: "¿Es seguro?", answer: "Sí, solo contenido público" }
    ],
    relatedTools: ["facebook-downloader", "tiktok-downloader", "x-video-downloader"],
  },
  {
    slug: "facebook-downloader",
    name: "Facebook Downloader",
    title: "Facebook Video Downloader - HD MP4 Gratis",
    description: "Download Facebook videos in HD quality.",
    longDescription:
      "Download Facebook videos and reels from public posts. Multiple quality options available. Fast and easy to use.",
    category: "media",
    keywords: [
      "facebook downloader",
      "facebook video download",
      "fb video download",
      "descargar facebook",
      "facebook downloader gratis",
      "facebook to mp4",
      "descargar videos facebook",
      "facebook downloader hd"
    ],
    icon: Download,
    iconName: "Download",
    available: true,
    primaryKeyword: "facebook video downloader",
    metaDescription: "Descarga videos de Facebook en MP4 gratis. HD calidad. Facebook video downloader sin marca de agua. ¡Rápido y fácil!",
    ogImage: "/images/facebook-downloader-og.jpg",
    useCases: [
      "Guardar videos de Facebook",
      "Descargar Facebook Reels",
      "Extraer videos de posts públicos"
    ],
    faq: [
      { question: "¿Funciona con Reels?", answer: "Sí, descarga videos y Reels de Facebook" }
    ],
    relatedTools: ["instagram-downloader", "tiktok-downloader", "youtube-downloader", "video-converter"],
  },
  {
    slug: "x-video-downloader",
    name: "X Video Downloader",
    title: "X Twitter Video Downloader - HD MP4 Gratis",
    description: "Download videos from X (formerly Twitter).",
    longDescription:
      "Download videos and GIFs from X/Twitter tweets. Support for both videos and animated GIFs. High quality downloads.",
    category: "media",
    keywords: [
      "x downloader",
      "twitter video download",
      "x video download",
      "descargar x",
      "x downloader gratis",
      "twitter to mp4",
      "descargar videos twitter",
      "x downloader hd"
    ],
    icon: Download,
    iconName: "Download",
    available: true,
    primaryKeyword: "x twitter video downloader",
    metaDescription: "Descarga videos de X/Twitter en MP4 gratis. HD calidad. Twitter video downloader sin marca de agua. ¡Rápido y fácil!",
    ogImage: "/images/x-downloader-og.jpg",
    useCases: [
      "Guardar videos de X/Twitter",
      "Descargar GIFs de tweets",
      "Extraer videos de posts públicos"
    ],
    faq: [
      { question: "¿Funciona con GIFs?", answer: "Sí, descarga videos y GIFs de X/Twitter" }
    ],
    relatedTools: ["instagram-downloader", "tiktok-downloader", "facebook-downloader", "video-converter"],
  },
  {
    slug: "video-converter",
    name: "Video Converter",
    title: "Video Format Converter",
    description: "Convert videos to MP3, MP4 and other formats.",
    longDescription:
      "Convert video files between different formats including MP4, WebM, and extract audio to MP3. Upload your file and choose the output format.",
    category: "media",
    keywords: ["video converter", "video to mp3", "video to mp4", "convertir video"],
    icon: Video,
    iconName: "Video",
    available: true,
    primaryKeyword: "video converter online",
    metaDescription: "Convert videos online free. Video to MP3, MP4, WebM. Extract audio from video. Fast video format converter.",
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    title: "Convertir PDF a JPG - Gratis Online",
    description: "Convert PDF pages to JPG images.",
    longDescription:
      "Extract pages from PDF files and convert them to high-quality JPG images. Upload your PDF and download individual pages as images.",
    category: "pdf",
    keywords: [
      "pdf to jpg",
      "pdf to image",
      "convert pdf to jpg",
      "pdf a imagen",
      "convertir pdf a jpg gratis",
      "pdf a jpg online",
      "extraer paginas pdf",
      "pdf to jpg converter"
    ],
    icon: Image,
    iconName: "Image",
    available: true,
    primaryKeyword: "pdf to jpg converter",
    metaDescription: "Convierte PDF a JPG online gratis. Extrae páginas de PDF como imágenes. Convertidor de PDF a imagen de alta calidad.",
    ogImage: "/images/pdf-to-jpg-og.jpg",
    useCases: [
      "Extraer páginas de PDF como imágenes",
      "Convertir documentos PDF a JPG",
      "Crear imágenes desde archivos PDF"
    ],
    relatedTools: ["jpg-to-pdf", "pdf-merger", "pdf-splitter", "image-compressor"],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    title: "Convertir JPG a PDF - Gratis Online",
    description: "Convert JPG images to PDF document.",
    longDescription:
      "Combine one or more JPG images into a single PDF document. Perfect for creating PDFs from photos or scans.",
    category: "pdf",
    keywords: [
      "jpg to pdf",
      "image to pdf",
      "convert jpg to pdf",
      "imagen a pdf",
      "convertir jpg a pdf gratis",
      "jpg a pdf online",
      "combinar imagenes pdf",
      "jpg to pdf converter"
    ],
    icon: Image,
    iconName: "Image",
    available: true,
    primaryKeyword: "jpg to pdf converter",
    metaDescription: "Convierte JPG a PDF online gratis. Combina imágenes en PDF. Convertidor de imagen a PDF para fotos y escaneos.",
    ogImage: "/images/jpg-to-pdf-og.jpg",
    useCases: [
      "Combinar fotos en un PDF",
      "Convertir escaneos a PDF",
      "Crear documentos desde imágenes"
    ],
    relatedTools: ["pdf-to-jpg", "pdf-merger", "image-resizer", "image-compressor"],
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    title: "Unir PDF - Combinar Archivos PDF Gratis",
    description: "Merge multiple PDF files into one.",
    longDescription:
      "Combine multiple PDF files into a single document. Upload PDFs in any order and download the merged result.",
    category: "pdf",
    keywords: [
      "pdf merger",
      "combine pdf",
      "merge pdf",
      "unir pdf",
      "combinar pdf gratis",
      "unir archivos pdf online",
      "merge pdf online",
      "pdf merger tool"
    ],
    icon: Merge,
    iconName: "Merge",
    available: true,
    primaryKeyword: "pdf merger online",
    metaDescription: "Une PDFs online gratis. Combina múltiples archivos PDF en uno. Herramienta para unir documentos PDF fácilmente.",
    ogImage: "/images/pdf-merger-og.jpg",
    useCases: [
      "Unir múltiples documentos PDF",
      "Combinar páginas de diferentes PDFs",
      "Crear un solo PDF desde varios archivos"
    ],
    relatedTools: ["pdf-splitter", "pdf-to-jpg", "jpg-to-pdf", "pdf-compressor"],
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    title: "Dividir PDF - Extraer Páginas Gratis",
    description: "Split PDF into separate pages or ranges.",
    longDescription:
      "Extract specific pages from a PDF or split it into individual pages. Perfect for separating chapters or sections.",
    category: "pdf",
    keywords: [
      "pdf splitter",
      "split pdf",
      "extract pdf pages",
      "dividir pdf",
      "dividir pdf gratis",
      "extraer paginas pdf online",
      "separar pdf",
      "pdf splitter tool"
    ],
    icon: Scissors,
    iconName: "Scissors",
    available: true,
    primaryKeyword: "pdf splitter online",
    metaDescription: "Divide PDFs online gratis. Extrae páginas o separa en PDFs individuales. Herramienta para dividir documentos PDF.",
    ogImage: "/images/pdf-splitter-og.jpg",
    useCases: [
      "Extraer páginas específicas de PDF",
      "Separar capítulos de un documento",
      "Dividir PDF en archivos individuales"
    ],
    relatedTools: ["pdf-merger", "pdf-to-jpg", "jpg-to-pdf", "pdf-compressor"],
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    title: "Comprimir PDF - Reducir Tamaño Gratis",
    description: "Compress PDF files to reduce size.",
    longDescription:
      "Compress PDF files to reduce their size for easier sharing and storage. Maintains document quality while optimizing file size.",
    category: "pdf",
    keywords: [
      "pdf compressor",
      "compress pdf",
      "reduce pdf size",
      "comprimir pdf",
      "comprimir pdf gratis",
      "reducir tamaño pdf online",
      "pdf compression tool",
      "optimizar pdf"
    ],
    icon: Minimize,
    iconName: "Minimize",
    available: true,
    primaryKeyword: "pdf compressor online",
    metaDescription: "Comprime PDFs online gratis. Reduce el tamaño de archivos PDF para compartir. Herramienta de compresión de PDF.",
    ogImage: "/images/pdf-compressor-og.jpg",
    useCases: [
      "Reducir tamaño de PDFs para email",
      "Comprimir PDFs para subir a web",
      "Optimizar PDFs para almacenamiento"
    ],
    relatedTools: ["pdf-merger", "pdf-splitter", "pdf-to-jpg", "jpg-to-pdf"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    title: "Comprimir Imágenes - Convertir a WebP Gratis",
    description: "Compress images and convert to WebP format.",
    longDescription:
      "Reduce image file size and convert PNG/JPG to WebP format for faster web loading. All processing happens locally in your browser.",
    category: "images",
    keywords: [
      "image compressor",
      "webp converter",
      "compress image",
      "optimize image",
      "webp",
      "comprimir imagenes gratis",
      "convertir a webp online",
      "optimizar imagenes web",
      "image compression tool"
    ],
    icon: Image,
    iconName: "Image",
    available: true,
    primaryKeyword: "image compressor webp",
    metaDescription: "Comprime imágenes online gratis. Convierte PNG/JPG a WebP. Optimización de imágenes para carga rápida en web.",
    ogImage: "/images/image-compressor-og.jpg",
    useCases: [
      "Optimizar imágenes para web",
      "Convertir PNG a WebP",
      "Reducir tamaño de imágenes"
    ],
    relatedTools: ["image-resizer", "svg-png-converter", "favicon-generator", "jpg-to-pdf"],
  },
  {
    slug: "svg-png-converter",
    name: "SVG to PNG",
    title: "SVG to PNG Converter",
    description: "Convert SVG vector graphics to PNG images.",
    longDescription:
      "Convert SVG files to PNG raster images with custom resolution. Perfect for when you need bitmap versions of vector graphics.",
    category: "images",
    keywords: ["svg to png", "convert svg", "vector to raster", "svg converter"],
    icon: Image,
    iconName: "Image",
    available: true,
    primaryKeyword: "svg to png converter",
    metaDescription: "Convert SVG to PNG online free. Vector to raster conversion. Custom resolution SVG converter.",
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    title: "Redimensionar Imágenes - Recortar para Redes Sociales",
    description: "Resize and crop images for social media.",
    longDescription:
      "Resize images to common social media dimensions (1:1, 16:9, 4:5) or custom sizes. Crop and optimize images for Instagram, Twitter, Facebook and more.",
    category: "images",
    keywords: [
      "image resizer",
      "crop image",
      "resize image",
      "social media image",
      "redimensionar imagenes gratis",
      "recortar imagenes online",
      "tamaño instagram twitter",
      "image resizer tool"
    ],
    icon: Image,
    iconName: "Image",
    available: true,
    primaryKeyword: "image resizer online",
    metaDescription: "Redimensiona imágenes online gratis. Recorta para redes sociales. Tamaños para Instagram, Twitter, Facebook. Herramienta perfecta.",
    ogImage: "/images/image-resizer-og.jpg",
    useCases: [
      "Redimensionar para Instagram",
      "Ajustar tamaño para Twitter",
      "Recortar para Facebook"
    ],
    relatedTools: ["image-compressor", "svg-png-converter", "favicon-generator", "jpg-to-pdf"],
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    title: "Generador de Favicon - Crear Iconos Gratis",
    description: "Generate complete favicon packages from images.",
    longDescription:
      "Upload a logo or image and generate a complete favicon package including .ico, PNGs for iOS/Android, and HTML code for implementation.",
    category: "images",
    keywords: [
      "favicon generator",
      "icon generator",
      "create favicon",
      "favicon maker",
      "generador de favicon gratis",
      "crear favicon online",
      "icono web generator",
      "favicon tool"
    ],
    icon: Image,
    iconName: "Image",
    available: true,
    primaryKeyword: "favicon generator online",
    metaDescription: "Genera favicons online gratis. Paquete completo con .ico, iOS, Android. Código HTML incluido. Crea iconos web fácil.",
    ogImage: "/images/favicon-generator-og.jpg",
    useCases: [
      "Crear favicon para sitio web",
      "Generar iconos para iOS y Android",
      "Crear iconos de aplicación"
    ],
    relatedTools: ["image-resizer", "image-compressor", "svg-png-converter"],
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    title: "CSS Box Shadow & Glassmorphism Generator",
    description: "Generate CSS box shadows and glass effects.",
    longDescription:
      "Create beautiful CSS box shadows and glassmorphism effects with an interactive visual editor. Copy the CSS code directly.",
    category: "development",
    keywords: ["css shadow generator", "box shadow", "glassmorphism", "css generator"],
    icon: Palette,
    iconName: "Palette",
    available: true,
    primaryKeyword: "css shadow generator",
    metaDescription: "Generate CSS box shadows online free. Glassmorphism effects. Visual CSS shadow editor with code export.",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    title: "Regular Expression Tester",
    description: "Test and debug regular expressions visually.",
    longDescription:
      "Test regular expressions against text with real-time highlighting. Get explanations of your regex patterns and matches.",
    category: "development",
    keywords: ["regex tester", "regular expression", "regex tester", "test regex"],
    icon: ScanText,
    iconName: "ScanText",
    available: true,
    primaryKeyword: "regex tester online",
    metaDescription: "Test regex online free. Visual regular expression tester with real-time highlighting. Debug regex patterns.",
    relatedTools: ["diff-checker", "json-formatter", "sql-formatter", "base64-encoder"],
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    title: "Text & Code Diff Checker",
    description: "Compare two texts or code blocks line by line.",
    longDescription:
      "Compare two pieces of text or code to see the differences highlighted. Perfect for reviewing changes or detecting plagiarism.",
    category: "development",
    keywords: ["diff checker", "compare text", "code diff", "text comparison"],
    icon: ScanText,
    iconName: "ScanText",
    available: true,
    primaryKeyword: "diff checker online",
    metaDescription: "Compare text online free. Diff checker for code and text. Line by line comparison tool.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    title: "SQL Query Formatter",
    description: "Format and beautify SQL queries.",
    longDescription:
      "Format SQL queries with proper indentation and structure. Makes complex SQL queries readable and maintainable.",
    category: "development",
    keywords: ["sql formatter", "format sql", "beautify sql", "sql beautifier"],
    icon: ScanText,
    iconName: "ScanText",
    available: true,
    primaryKeyword: "sql formatter online",
    metaDescription: "Format SQL queries online free. Beautify SQL with proper indentation. SQL query formatter for developers.",
  },
  {
    slug: "pdf-watermark",
    name: "PDF Watermark",
    title: "PDF Watermark Adder",
    description: "Add text or image watermarks to PDF files.",
    longDescription:
      "Add custom text or image watermarks to your PDF documents. Protect your documents with branding or copyright notices.",
    category: "pdf",
    keywords: ["pdf watermark", "add watermark", "watermark pdf", "marca de agua pdf"],
    icon: FileText,
    iconName: "FileText",
    available: true,
    primaryKeyword: "pdf watermark online",
    metaDescription: "Add watermarks to PDF online free. Text and image watermarks. Protect PDF documents with branding.",
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    title: "URL Slug Generator",
    description: "Convert titles to SEO-friendly URL slugs.",
    longDescription:
      "Convert any title or text into a clean, SEO-friendly URL slug. Perfect for blog posts, articles, and web pages.",
    category: "text",
    keywords: ["slug generator", "url slug", "seo friendly url", "clean url"],
    icon: ScanText,
    iconName: "ScanText",
    available: true,
    primaryKeyword: "slug generator online",
    metaDescription: "Generate URL slugs online free. SEO-friendly URL generator. Clean URLs for blog posts and pages.",
  },
  {
    slug: "paraphraser",
    name: "Paraphraser",
    title: "Text Paraphraser",
    description: "Rewrite text with different wording.",
    longDescription:
      "Rewrite your text with different wording while maintaining the original meaning. Great for avoiding plagiarism and creating unique content.",
    category: "text",
    keywords: ["paraphraser", "rewrite text", "text rewriter", "avoid plagiarism"],
    icon: ScanText,
    iconName: "ScanText",
    available: true,
    primaryKeyword: "text paraphraser online",
    metaDescription: "Paraphrase text online free. Rewrite content with different wording. Avoid plagiarism with AI paraphraser.",
  },
  {
    slug: "ai-detector",
    name: "AI Detector",
    title: "AI Content Detector",
    description: "Detect if text was written by AI.",
    longDescription:
      "Analyze text to detect if it was likely written by AI or by a human. Uses pattern analysis and linguistic markers to estimate AI probability.",
    category: "text",
    keywords: ["ai detector", "ai content detector", "check ai text", "human vs ai"],
    icon: Shield,
    iconName: "Shield",
    available: true,
    primaryKeyword: "ai content detector",
    metaDescription: "Detect AI-written text online free. AI content checker. Human vs AI text analysis with probability scores.",
    relatedTools: ["paraphraser", "fake-news-detector", "ai-chat", "word-counter"],
  },
  {
    slug: "calculator",
    name: "Calculator",
    title: "Scientific Calculator",
    description: "Advanced calculator with scientific functions.",
    longDescription:
      "Perform basic and scientific calculations including trigonometry, logarithms, and more. Perfect for students, engineers, and professionals.",
    category: "converters",
    keywords: ["calculator", "scientific calculator", "math calculator", "online calculator"],
    icon: Calculator,
    iconName: "Calculator",
    available: true,
    primaryKeyword: "scientific calculator online",
    metaDescription: "Scientific calculator online free. Trigonometry, logarithms, math functions. Perfect for students and engineers.",
  },
  {
    slug: "translator",
    name: "Translator",
    title: "Text Translator",
    description: "Translate text between multiple languages.",
    longDescription:
      "Translate text between different languages quickly and easily. Supports multiple language pairs for your translation needs.",
    category: "text",
    keywords: ["translator", "text translator", "language translator", "translate"],
    icon: Languages,
    iconName: "Languages",
    available: true,
    primaryKeyword: "text translator online",
    metaDescription: "Translate text online free. Multiple language pairs. Fast text translator for all languages.",
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    title: "Currency Exchange Calculator",
    description: "Convert between different currencies.",
    longDescription:
      "Convert amounts between different currencies using real-time exchange rates. Perfect for travelers, shoppers, and international business.",
    category: "converters",
    keywords: ["currency converter", "exchange rate", "money converter", "forex"],
    icon: DollarSign,
    iconName: "DollarSign",
    available: true,
    primaryKeyword: "currency converter online",
    metaDescription: "Convert currencies online free. Real-time exchange rates. Currency calculator for travelers and business.",
  },
  {
    slug: "ats-resume-analyzer",
    name: "ATS Resume Analyzer",
    title: "ATS Resume Checker",
    description: "Check if your resume passes ATS systems.",
    longDescription:
      "Analyze your resume to see if it will pass Applicant Tracking Systems (ATS). Get suggestions to improve your resume and increase interview chances.",
    category: "text",
    keywords: ["ats analyzer", "resume checker", "cv analyzer", "ats friendly"],
    icon: FileText,
    iconName: "FileText",
    available: true,
    primaryKeyword: "ats resume checker",
    metaDescription: "Check resume ATS compatibility online free. ATS resume analyzer. Improve CV for job applications.",
  },
  {
    slug: "image-generator",
    name: "Image Generator",
    title: "AI Image Generator",
    description: "Generate images using AI from text descriptions.",
    longDescription:
      "Create stunning images from text descriptions using AI. Perfect for creative projects, social media, and design inspiration.",
    category: "generators",
    keywords: ["image generator", "ai image", "text to image", "create images"],
    icon: Sparkles,
    iconName: "Sparkles",
    available: true,
    primaryKeyword: "ai image generator free",
    metaDescription: "Generate AI images online free. Text to image generator. Create stunning visuals with AI for social media.",
  },
  {
    slug: "ai-chat",
    name: "AI Chat",
    title: "AI Assistant Chat",
    description: "Chat with an AI assistant for general help.",
    longDescription:
      "Have conversations with an AI assistant powered by Google AI. Get help with various tasks, ask questions, or just have a chat.",
    category: "text",
    keywords: ["ai chat", "chatbot", "assistant", "gemini", "chatgpt"],
    icon: MessageSquare,
    iconName: "MessageSquare",
    available: true,
    primaryKeyword: "ai chat assistant",
    metaDescription: "Chat with AI assistant online free. AI chatbot for help and questions. Powered by Google AI for conversations.",
  },
  {
    slug: "qr-reader",
    name: "QR Reader",
    title: "QR Code Scanner",
    description: "Scan and decode QR codes from images or camera.",
    longDescription:
      "Scan QR codes from uploaded images or directly from your camera. Decode URLs, text, and other data stored in QR codes instantly.",
    category: "converters",
    keywords: ["qr scanner", "qr reader", "decode qr", "scan qr"],
    icon: QrCode,
    iconName: "QrCode",
    available: true,
    primaryKeyword: "qr code scanner",
    metaDescription: "Scan QR codes online free. Decode QR from images or camera. QR reader for URLs and text.",
  },
  {
    slug: "wifi-qr-reader",
    name: "WiFi QR Reader",
    title: "WiFi QR Scanner",
    description: "Scan WiFi QR codes to connect to networks.",
    longDescription:
      "Scan WiFi QR codes to instantly connect to wireless networks. Extract SSID, password, and encryption type from WiFi QR codes.",
    category: "converters",
    keywords: ["wifi qr", "wifi scanner", "connect wifi", "wifi password"],
    icon: Wifi,
    iconName: "Wifi",
    available: true,
    primaryKeyword: "wifi qr scanner",
    metaDescription: "Scan WiFi QR codes online free. Connect to networks instantly. Extract SSID and password from WiFi QR.",
  },
]

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug)
}

export function getCategory(slug: string): ToolCategory | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getIconName(tool: Tool): string {
  if (tool.iconName) return tool.iconName
  // Derive icon name from the icon function if not provided
  return tool.icon.name || 'FileText'
}

export function toolsByCategory(categorySlug: string): Tool[] {
  return tools.filter((t) => t.category === categorySlug)
}

export function availableTools(): Tool[] {
  return tools.filter((t) => t.available)
}

/** Related tools = custom relatedTools if available, otherwise same category, then fill with others. */
export function relatedTools(slug: string, limit = 4): Tool[] {
  const current = getTool(slug)
  if (!current) return []
  
  // Use custom relatedTools if available
  if (current.relatedTools && current.relatedTools.length > 0) {
    const customRelated = current.relatedTools
      .map(rs => getTool(rs))
      .filter((t): t is Tool => t !== undefined && t.available)
    return customRelated.slice(0, limit)
  }
  
  // Fallback to category-based suggestions
  const sameCategory = tools.filter((t) => t.category === current.category && t.slug !== slug && t.available)
  const others = tools.filter((t) => t.category !== current.category && t.slug !== slug && t.available)
  return [...sameCategory, ...others].slice(0, limit)
}

export function toolMetadata(slug: string) {
  const tool = getTool(slug)
  if (!tool) return {}
  const url = `${SITE.url}/${slug}`
  const category = getCategory(tool.category)
  
  // Schema.org FAQPage structured data
  const faqSchema = tool.faq ? {
    "@type": "FAQPage",
    mainEntity: tool.faq.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  } : null

  // Schema.org SoftwareApplication structured data
  const softwareSchema = {
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.longDescription,
    applicationCategory: category?.name || "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: tool.keywords.join(", "),
    browserRequirements: "Requires JavaScript. Requires HTML5."
  }

  return {
    title: `${tool.title} - Gratis Online | ${SITE.name}`,
    description: tool.metaDescription || `${tool.longDescription} Gratis, sin registro, online. ${tool.keywords.slice(0, 3).join(", ")}.`,
    keywords: tool.keywords.join(", "),
    alternates: { canonical: url },
    openGraph: {
      type: "website" as const,
      title: `${tool.title} - Gratis Online | ${SITE.name}`,
      description: tool.metaDescription || `${tool.longDescription} Gratis, sin registro, online.`,
      url,
      siteName: SITE.name,
      locale: "es_ES",
      images: tool.ogImage ? [{ url: `${SITE.url}${tool.ogImage}`, width: 1200, height: 630, alt: tool.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${tool.title} - Gratis Online | ${SITE.name}`,
      description: tool.metaDescription || `${tool.longDescription} Gratis, sin registro, online.`,
      images: tool.ogImage ? [`${SITE.url}${tool.ogImage}`] : undefined,
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": url,
            url,
            name: tool.title,
            description: tool.longDescription,
            inLanguage: "es",
            isPartOf: {
              "@type": "WebSite",
              "@id": SITE.url,
              name: SITE.name,
              url: SITE.url
            },
            about: softwareSchema
          },
          softwareSchema,
          ...(faqSchema ? [faqSchema] : [])
        ]
      })
    }
  }
}
