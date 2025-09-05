import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Age Calculator - Calculate Your Exact Age',
  description: 'A simple and accurate age calculator that shows your exact age in years, months, days, hours, and minutes. Easy to use and mobile-friendly.',
  keywords: 'age calculator, birthday calculator, age in years months days, online calculator',
  authors: [{ name: 'Age Calculator' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Age Calculator - Calculate Your Exact Age',
    description: 'A simple and accurate age calculator that shows your exact age in years, months, days, hours, and minutes.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator - Calculate Your Exact Age',
    description: 'A simple and accurate age calculator that shows your exact age in years, months, days, hours, and minutes.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload Google Fonts */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload critical pages */}
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/contact" />
        <link rel="prefetch" href="/privacy" />
        <link rel="prefetch" href="/disclaimer" />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Age Calculator" />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
