import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'GlowMind – Kişisel Saç & Cilt Bakım Danışmanı',
  description:
    'AI destekli kişisel saç ve cilt bakım analizi. Fotoğraflarınızı yükleyin, size özel bakım rutininizi alın.',
  keywords: 'saç bakımı, cilt bakımı, AI analiz, bakım rutini, güzellik danışmanı',
  openGraph: {
    title: 'GlowMind – Kişisel Saç & Cilt Bakım Danışmanı',
    description: 'AI destekli kişisel saç ve cilt bakım analizi',
    type: 'website',
    locale: 'tr_TR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#3d2c2c',
              borderRadius: '12px',
              border: '1px solid #fecdd3',
              boxShadow: '0 4px 20px rgba(183, 110, 121, 0.15)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#b76e79', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#e11d48', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
