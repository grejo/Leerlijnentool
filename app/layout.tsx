import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import './globals.css'
import Providers from './providers'

// PXL Brand Fonts
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-raleway',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Leerlijnentool - PXL',
  description: 'Curriculum Management Applicatie - Hogeschool PXL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${raleway.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
