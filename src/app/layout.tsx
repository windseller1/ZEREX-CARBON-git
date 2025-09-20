import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zyra Carbon – Carbon-NFT Marketplace',
  description: 'Trade, mint and stake verified carbon credits as NFTs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}