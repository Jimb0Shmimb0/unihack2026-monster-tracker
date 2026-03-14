import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

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

const y2kBrutalism = localFont({
  src: './fonts/y2k-brutalism.otf',
  variable: '--font-y2k',
  weight: '100 900',
})

const chetkiy = localFont({
  src: './fonts/chetkiy.otf',
  variable: '--font-chetkiy',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'VOLT - Energy Drink Price Tracker',
  description: 'Track Monster Energy drink prices in real time across Amazon, Walmart, Target, 7-Eleven, Costco and more. Compare by caffeine content, price per serving, and size.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable} ${y2kBrutalism.variable} ${chetkiy.variable}`}>
        {children}
      </body>
    </html>
  )
}
