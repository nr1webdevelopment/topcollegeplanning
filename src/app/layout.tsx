import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/lib/i18n'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Top College Planning – Your pathway to elite education and success',
    template: '%s | Top College Planning',
  },
  description: 'We are an alumni network of the top colleges in the United States, United Kingdom, and Canada. Expert advisors from the Top 50 US Universities.',
  metadataBase: new URL('https://topcollegeplanning.com'),
  openGraph: {
    siteName: 'Top College Planning',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
