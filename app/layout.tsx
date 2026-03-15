import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'
import Cursor from '@/components/Cursor'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-grotesk',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'VOLT — Energy Drink Price Tracker',
  description: 'Track Monster Energy drink prices in real time across 7-Eleven, Woolworths, Coles, Costco and more. Compare by caffeine content, price per serving, and size.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <Cursor />
        {children}
      </body>
    </html>
  )
}
