import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { SITE } from "@/lib/tools"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AdSenseScript } from "@/components/adsense-loader"
import { Chatbot } from "@/components/chatbot"
import { CookieBanner } from "@/components/cookie-banner"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["online tools", "developer tools", "free tools", "web utilities"],
  applicationName: SITE.name,
  generator: "v0.app",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  icons: {
    icon: "/nexora.png",
    apple: "/nexora.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfcfe" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`bg-background ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: `(function() {
  try {
    var t = localStorage.getItem('theme');
    var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    if (t) document.documentElement.classList.add(t);
  } catch (e) {}
})();`
          }}
        />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <AdSenseScript />
        {process.env.NODE_ENV === "production" && <Analytics />}
        <Chatbot />
        <CookieBanner />
      </body>
    </html>
  )
}
