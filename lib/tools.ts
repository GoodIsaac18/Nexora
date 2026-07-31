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
  Crop,
  Sparkles,
  Search,
  Code2,
  GitCompare,
  Database,
  Droplets,
  Globe,
  Star,
  Heart,
  RefreshCw,
  Bot,
  BrainCircuit,
  Calculator,
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
  name: "Nexora",
  tagline: "Fast, free tools for developers & creators",
  description:
    "A growing collection of fast, privacy-friendly online tools. Format JSON, generate passwords, pick colors, convert Markdown and more — all in your browser.",
  url: "https://nexora.example.com",
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
  /** true once the page under /app/<slug>/page.tsx exists */
  available: boolean
  /** Optional custom guide for the tool */
  guide?: string
  /** Optional custom FAQ for the tool */
  faq?: { question: string; answer: string }[]
  /** Optional related tool slugs for tool chaining */
  relatedTools?: string[]
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
    title: "JSON Formatter & Validator",
    description: "Beautify, minify and validate JSON instantly.",
    longDescription:
      "Format messy JSON into clean, readable output, minify it for production, and catch syntax errors as you type. Everything runs locally in your browser.",
    category: "converters",
    keywords: ["json formatter", "json beautifier", "json validator", "pretty print json", "minify json"],
    icon: Braces,
    available: true,
    relatedTools: ["base64-encoder", "url-encoder", "jwt-decoder"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    title: "Secure Password Generator",
    description: "Create strong, random passwords with custom rules.",
    longDescription:
      "Generate cryptographically strong passwords with adjustable length, symbols, numbers and casing. Includes a live strength meter. Nothing is ever sent to a server.",
    category: "generators",
    keywords: ["password generator", "random password", "strong password", "secure password"],
    icon: KeyRound,
    available: true,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    title: "UUID / GUID Generator",
    description: "Generate v4 UUIDs in bulk and copy them fast.",
    longDescription:
      "Generate RFC 4122 version 4 UUIDs one at a time or in bulk. Copy individual values or the whole list with a single click.",
    category: "generators",
    keywords: ["uuid generator", "guid generator", "uuid v4", "unique id"],
    icon: FingerprintPattern,
    available: true,
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
    available: true,
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
    available: true,
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
    available: true,
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
    available: true,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    title: "Word & Character Counter",
    description: "Count words, characters, sentences and reading time.",
    longDescription:
      "Paste your text to see live counts for words, characters, sentences and paragraphs, plus an estimated reading time.",
    category: "text",
    keywords: ["word counter", "character counter", "reading time", "text counter"],
    icon: ScanText,
    available: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    title: "Text Case Converter",
    description: "Convert text between camelCase, snake_case and more.",
    longDescription:
      "Instantly convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case and CONSTANT_CASE.",
    category: "text",
    keywords: ["case converter", "camelcase", "snake case", "kebab case", "title case"],
    icon: Type,
    available: true,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    title: "SHA Hash Generator",
    description: "Generate SHA-1, SHA-256 and SHA-512 hashes.",
    longDescription:
      "Generate cryptographic hashes (SHA-1, SHA-256, SHA-384, SHA-512) from any text using the browser's built-in Web Crypto API.",
    category: "generators",
    keywords: ["hash generator", "sha256 generator", "sha512", "checksum"],
    icon: Hash,
    available: true,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    title: "URL Encoder & Decoder",
    description: "Encode or decode URL components safely.",
    longDescription:
      "Encode text for safe use in URLs and decode percent-encoded strings back to readable text.",
    category: "converters",
    keywords: ["url encoder", "url decoder", "percent encoding", "uri encode"],
    icon: Link2,
    available: true,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder paragraphs, sentences or words.",
    longDescription:
      "Generate classic lorem ipsum placeholder text by paragraphs, sentences or words for mockups and prototypes.",
    category: "generators",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text"],
    icon: Type,
    available: true,
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    title: "Unix Timestamp Converter",
    description: "Convert between Unix timestamps and human dates.",
    longDescription: "Convert Unix timestamps to human-readable dates and back across time zones.",
    category: "converters",
    keywords: ["unix timestamp", "epoch converter", "timestamp to date"],
    icon: Clock,
    available: true,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    title: "Unit Converter",
    description: "Convert length, weight, temperature and more.",
    longDescription: "Convert between metric and imperial units for length, weight, temperature and volume.",
    category: "converters",
    keywords: ["unit converter", "metric to imperial", "length converter"],
    icon: Ruler,
    available: true,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    title: "QR Code Generator",
    description: "Turn any link or text into a QR code.",
    longDescription: "Generate downloadable QR codes for URLs, text, Wi-Fi credentials and more.",
    category: "generators",
    keywords: ["qr code generator", "qr code maker"],
    icon: QrCode,
    available: true,
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
    available: true,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens.",
    longDescription: "Decode the header and payload of any JWT to inspect its claims locally.",
    category: "web",
    keywords: ["jwt decoder", "json web token", "decode jwt"],
    icon: Lock,
    available: true,
  },
  {
    slug: "whatsapp-link-generator",
    name: "WhatsApp Link",
    title: "WhatsApp Link Generator",
    description: "Create wa.me links with optional pre-filled messages.",
    longDescription:
      "Build shareable WhatsApp click-to-chat links with country code, phone number and an optional pre-filled message. Copy wa.me or api.whatsapp.com formats.",
    category: "web",
    keywords: ["whatsapp link generator", "wa.me link", "click to chat whatsapp"],
    icon: MessageCircle,
    available: true,
  },
  {
    slug: "link-shortener",
    name: "Link Shortener",
    title: "URL Link Shortener",
    description: "Shorten long URLs for easy sharing.",
    longDescription:
      "Paste a long URL and get a shorter link ready to share. Shortening is handled server-side via is.gd; we do not store your links.",
    category: "web",
    keywords: ["link shortener", "url shortener", "short link", "acortador de enlaces"],
    icon: Minimize2,
    available: true,
  },
  {
    slug: "utm-link-builder",
    name: "UTM Builder",
    title: "UTM Link Builder",
    description: "Add campaign tracking parameters to any URL.",
    longDescription:
      "Generate marketing URLs with utm_source, utm_medium, utm_campaign and optional term/content tags for analytics.",
    category: "web",
    keywords: ["utm builder", "utm generator", "campaign url", "utm link"],
    icon: Megaphone,
    available: true,
  },
  {
    slug: "tiktok-downloader",
    name: "TikTok Downloader",
    title: "TikTok Video Downloader",
    description: "Download TikTok videos without watermark.",
    longDescription:
      "Paste a TikTok link and download videos without watermark in HD quality. Also extract audio as MP3. Fast and free.",
    category: "media",
    keywords: ["tiktok downloader", "tiktok video download", "tiktok no watermark", "descargar tiktok"],
    icon: Download,
    available: true,
  },
  {
    slug: "youtube-downloader",
    name: "YouTube Downloader",
    title: "YouTube Video Downloader",
    description: "Download YouTube videos in multiple formats.",
    longDescription:
      "Download YouTube videos in various qualities including HD. Extract audio as MP3 or M4A. Choose from multiple format options.",
    category: "media",
    keywords: ["youtube downloader", "youtube video download", "youtube to mp3", "descargar youtube"],
    icon: Play,
    available: true,
  },
  {
    slug: "instagram-downloader",
    name: "Instagram Downloader",
    title: "Instagram Video & Reel Downloader",
    description: "Download Instagram reels, stories and videos.",
    longDescription:
      "Download Instagram Reels, videos, and photo posts. Support for multiple media items in a single post. High quality downloads.",
    category: "media",
    keywords: ["instagram downloader", "instagram reel download", "instagram video download", "descargar instagram"],
    icon: Camera,
    available: true,
  },
  {
    slug: "facebook-downloader",
    name: "Facebook Downloader",
    title: "Facebook Video Downloader",
    description: "Download Facebook videos in HD quality.",
    longDescription:
      "Download Facebook videos and reels from public posts. Multiple quality options available. Fast and easy to use.",
    category: "media",
    keywords: ["facebook downloader", "facebook video download", "fb video download", "descargar facebook"],
    icon: Monitor,
    available: true,
  },
  {
    slug: "x-video-downloader",
    name: "X Video Downloader",
    title: "X / Twitter Video Downloader",
    description: "Download videos from X (formerly Twitter).",
    longDescription:
      "Download videos and GIFs from X/Twitter tweets. Support for both videos and animated GIFs. High quality downloads.",
    category: "media",
    keywords: ["x downloader", "twitter video download", "x video download", "descargar x"],
    icon: Video,
    available: true,
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
    icon: Music,
    available: true,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    title: "PDF to JPG Converter",
    description: "Convert PDF pages to JPG images.",
    longDescription:
      "Extract pages from PDF files and convert them to high-quality JPG images. Upload your PDF and download individual pages as images.",
    category: "pdf",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg", "pdf a imagen"],
    icon: ImageIcon,
    available: true,
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    title: "JPG to PDF Converter",
    description: "Convert JPG images to PDF document.",
    longDescription:
      "Combine one or more JPG images into a single PDF document. Perfect for creating PDFs from photos or scans.",
    category: "pdf",
    keywords: ["jpg to pdf", "image to pdf", "convert jpg to pdf", "imagen a pdf"],
    icon: FileText,
    available: true,
  },
  {
    slug: "pdf-unlocker",
    name: "PDF Unlocker",
    title: "PDF Password Remover",
    description: "Remove password protection from PDF files.",
    longDescription:
      "Unlock password-protected PDF files by removing the security. Upload your PDF with password and get an unlocked version.",
    category: "pdf",
    keywords: ["pdf unlocker", "pdf password remover", "unlock pdf", "desbloquear pdf"],
    icon: Unlock,
    available: false,
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    title: "Combine PDF Files",
    description: "Merge multiple PDF files into one.",
    longDescription:
      "Combine multiple PDF files into a single document. Upload PDFs in any order and download the merged result.",
    category: "pdf",
    keywords: ["pdf merger", "combine pdf", "merge pdf", "unir pdf"],
    icon: Merge,
    available: true,
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    title: "Split PDF Files",
    description: "Split PDF into separate pages or ranges.",
    longDescription:
      "Extract specific pages from a PDF or split it into individual pages. Perfect for separating chapters or sections.",
    category: "pdf",
    keywords: ["pdf splitter", "split pdf", "extract pdf pages", "dividir pdf"],
    icon: Scissors,
    available: true,
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    title: "PDF File Compressor",
    description: "Compress PDF files to reduce size.",
    longDescription:
      "Compress PDF files to reduce their size for easier sharing and storage. Maintains document quality while optimizing file size.",
    category: "pdf",
    keywords: ["pdf compressor", "compress pdf", "reduce pdf size", "comprimir pdf"],
    icon: Minimize,
    available: true,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    title: "Image Compressor & WebP Converter",
    description: "Compress images and convert to WebP format.",
    longDescription:
      "Reduce image file size and convert PNG/JPG to WebP format for faster web loading. All processing happens locally in your browser.",
    category: "images",
    keywords: ["image compressor", "webp converter", "compress image", "optimize image", "webp"],
    icon: Sparkles,
    available: true,
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
    icon: ImageIcon,
    available: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    title: "Image Resizer & Cropper",
    description: "Resize and crop images for social media.",
    longDescription:
      "Resize images to common social media dimensions (1:1, 16:9, 4:5) or custom sizes. Crop and optimize images for Instagram, Twitter, Facebook and more.",
    category: "images",
    keywords: ["image resizer", "crop image", "resize image", "social media image"],
    icon: Crop,
    available: true,
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    title: "Favicon Generator",
    description: "Generate complete favicon packages from images.",
    longDescription:
      "Upload a logo or image and generate a complete favicon package including .ico, PNGs for iOS/Android, and HTML code for implementation.",
    category: "images",
    keywords: ["favicon generator", "icon generator", "create favicon", "favicon maker"],
    icon: Star,
    available: true,
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
    icon: Droplets,
    available: true,
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
    icon: Search,
    available: true,
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
    icon: GitCompare,
    available: true,
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
    icon: Database,
    available: true,
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
    available: true,
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
    icon: Globe,
    available: true,
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
    icon: RefreshCw,
    available: true,
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
    icon: Bot,
    available: true,
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
    available: true,
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
    available: true,
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
    available: true,
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
    icon: Briefcase,
    available: true,
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
    icon: Image,
    available: true,
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
    icon: MessageCircle,
    available: true,
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
    icon: Scan,
    available: true,
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
    available: true,
  },
]

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug)
}

export function getCategory(slug: string): ToolCategory | undefined {
  return categories.find((c) => c.slug === slug)
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
    description: `${tool.longDescription} Gratis, sin registro, online. ${tool.keywords.slice(0, 3).join(", ")}.`,
    keywords: tool.keywords.join(", "),
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website" as const,
      title: `${tool.title} - Gratis Online | ${SITE.name}`,
      description: `${tool.longDescription} Gratis, sin registro, online.`,
      url,
      siteName: SITE.name,
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${tool.title} - Gratis Online | ${SITE.name}`,
      description: `${tool.longDescription} Gratis, sin registro, online.`,
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
