# Anubis AI

Anubis AI es una plataforma de herramientas online orientada a velocidad, privacidad y claridad de uso. El proyecto reúne utilidades para desarrolladores, creadores de contenido y usuarios generales en una sola experiencia web, sin necesidad de registro y con procesamiento local cuando la herramienta lo permite.

## Resumen ejecutivo

El objetivo de Anubis AI es ofrecer una colección amplia de herramientas prácticas que puedan resolverse en pocos pasos, con una interfaz moderna y una estructura pensada para descubrimiento por categorías, SEO y navegación directa.

## Principios del producto

- Privacidad primero: las herramientas que lo permiten procesan la información directamente en el navegador.
- Acceso sin fricción: no se requiere cuenta para usar las utilidades principales.
- Rapidez de uso: cada herramienta está diseñada para resolver una tarea concreta con la menor cantidad de pasos posible.
- Organización por intención: el catálogo está agrupado por categorías para facilitar la exploración.
- Experiencia responsive: la interfaz se adapta a desktop, tablet y móvil.

## Funcionalidades principales

### Conversión y formato

Herramientas para transformar datos entre distintos formatos.

| Herramienta | Descripción |
|-------------|-------------|
| JSON Formatter | Formatea, minifica y valida JSON al instante |
| Markdown to HTML | Convierte Markdown a HTML con vista previa en vivo |
| Base64 Encoder/Decode | Codifica texto a Base64 o lo decodifica |
| URL Encoder/Decoder | Codifica o decodifica componentes de URL de forma segura |
| Timestamp Converter | Convierte entre timestamps Unix y fechas legibles |
| Unit Converter | Convierte entre unidades métricas e imperiales |

### Generación

Herramientas para crear valores únicos, contenido base y activos reutilizables.

| Herramienta | Descripción |
|-------------|-------------|
| Password Generator | Genera contraseñas seguras con reglas personalizadas |
| UUID Generator | Genera UUID v4 de forma individual o masiva |
| Hash Generator | Genera hashes criptográficos como SHA-1, SHA-256 y SHA-512 |
| Lorem Ipsum Generator | Genera texto de relleno por párrafos, oraciones o palabras |
| QR Code Generator | Convierte texto o enlaces en códigos QR descargables |

### Texto y contenido

Utilidades para manipular, analizar y limpiar texto.

| Herramienta | Descripción |
|-------------|-------------|
| Word Counter | Cuenta palabras, caracteres, oraciones y tiempo de lectura |
| Case Converter | Convierte texto entre múltiples estilos de capitalización |

### Web y SEO

Utilidades para construcción, optimización y distribución web.

| Herramienta | Descripción |
|-------------|-------------|
| Meta Tag Generator | Genera metadatos SEO, Open Graph y Twitter Card |
| YouTube Thumbnail Downloader | Descarga miniaturas de videos de YouTube en distintas resoluciones |
| JWT Decoder | Decodifica e inspecciona JSON Web Tokens localmente |
| WhatsApp Link Generator | Crea enlaces wa.me con mensajes prellenados opcionales |
| Link Shortener | Acorta URLs largas para compartir fácilmente |
| UTM Link Builder | Agrega parámetros de seguimiento a cualquier URL |

### Diseño y color

Herramientas enfocadas en selección cromática y composición visual.

| Herramienta | Descripción |
|-------------|-------------|
| Color Picker | Convierte entre HEX, RGB y HSL a partir de un color elegido |

### Media y video

Herramientas para descarga, extracción y conversión de contenido multimedia.

| Herramienta | Descripción |
|-------------|-------------|
| TikTok Downloader | Descarga videos de TikTok sin marca de agua |
| YouTube Downloader | Descarga videos de YouTube y extrae audio en distintos formatos |
| Instagram Downloader | Descarga reels, videos y fotos de Instagram |
| Facebook Downloader | Descarga videos de Facebook en distintas calidades |
| X Video Downloader | Descarga videos y GIFs de X/Twitter |
| Video Converter | Convierte videos entre formatos y extrae audio |

### PDF

Conjunto de herramientas para convertir, fusionar, dividir y optimizar documentos PDF.

| Herramienta | Descripción |
|-------------|-------------|
| PDF to JPG | Convierte páginas de PDF a imágenes JPG |
| JPG to PDF | Combina una o más imágenes en un documento PDF |
| PDF Unlocker | Elimina la protección por contraseña de archivos PDF |
| PDF Merger | Fusiona múltiples archivos PDF en uno solo |
| PDF Splitter | Divide PDFs en páginas individuales o rangos personalizados |
| PDF Compressor | Comprime archivos PDF reduciendo su tamaño |

## Arquitectura técnica

El proyecto está construido con el siguiente stack:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Vercel Analytics
- shadcn/ui y componentes auxiliares internos

## Instalación y ejecución

### Requisitos

- Node.js instalado
- npm o pnpm como gestor de paquetes

### Instalación

```bash
git clone <repository-url>
cd digital-tool-library
npm install
```

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

## Configuración

El proyecto puede requerir variables de entorno para funcionalidades como publicidad, analítica o integraciones externas.

Variables recomendadas:

- `SUPABASE_URL`: URL de tu proyecto de Supabase para el backend.
- `SUPABASE_PUBLISHABLE_KEY`: clave pública para validación y contexto de usuario.
- `SUPABASE_SECRET_KEY`: clave secreta para las rutas del backend.
- `SUPABASE_JWKS_URL`: endpoint JWKS para verificación de JWT.
- `NEXT_PUBLIC_SUPABASE_URL`: URL pública usada por los helpers del navegador.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave pública usada por los helpers del navegador.
- `NEXT_PUBLIC_ADSENSE_CLIENT`: identificador de cliente de AdSense.
- `NEXT_PUBLIC_ADS_SLOT_HOME_LEADERBOARD`, `NEXT_PUBLIC_ADS_SLOT_HOME_INFEED`, `NEXT_PUBLIC_ADS_SLOT_TOOL_TOP`, `NEXT_PUBLIC_ADS_SLOT_TOOL_SIDEBAR`, `NEXT_PUBLIC_ADS_SLOT_FOOTER`: IDs de slot de anuncios.

Para una instalación local, copia el archivo de ejemplo de entorno si está disponible y completa los valores necesarios.

## Estructura del proyecto

- `app/`: páginas, layouts, rutas y metadatos.
- `components/`: interfaz reutilizable y módulos específicos de cada herramienta.
- `lib/`: configuración de sitio, catálogo de herramientas y utilidades compartidas.
- `hooks/`: lógica reutilizable para estado y comportamiento.
- `public/`: activos estáticos como imágenes, scripts y recursos compartidos.

## Estado del proyecto

Anubis AI se encuentra en una fase funcional avanzada. El catálogo principal ya está definido y las herramientas están organizadas por categorías. El siguiente foco natural del proyecto es fortalecer la documentación operativa, la validación automatizada y la expansión del contenido SEO por categoría.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas proponer una mejora, corregir un comportamiento o incorporar una herramienta nueva, abre un issue o pull request con una descripción clara del cambio.

## Soporte

Para reportar errores o solicitar nuevas funcionalidades, utiliza el sistema de issues del repositorio.

## Licencia

Este proyecto se distribuye bajo licencia MIT.

---

**Total de herramientas**: 28+ herramientas organizadas en categorías funcionales
