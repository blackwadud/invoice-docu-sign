import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DocuSign Clone',
  description: 'Secure document signing with blockchain + Firebase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning prevents mismatches on injected attributes */}
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
